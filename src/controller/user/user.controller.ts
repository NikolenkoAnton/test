import { isNumber } from 'class-validator';
import { Request } from 'express';
import { castArray } from 'lodash';
import { Body, Get, Post, Req, QueryParam } from 'routing-controllers';
import pkg, { Op, WhereOptions } from 'sequelize';
import { ApiOperationGet, ApiOperationPost } from 'swagger-express-ts';
import { Inject } from 'typedi';
import {
  activities,
  auth,
  createPass,
  deleteRole,
  forgot,
  getPermissions,
  getRoles, getUser,
  getUsers,
  meSchema,
  permission,
  saveRole,
  saveUser,
  updateProfile,
} from '../../../swagger/operations/user';
import config from '../../config';
import sequelize from '../../db';
import { Permission, PermissionRole, Role, RoleUser, User, UserLog } from '../../db/models';
import { GetPermissionsResponseDto, GetRolesResponseDto, SuccessStatusResponse } from '../../dto';
import { USER_LOG_ACTIONS, USER_LOG_SEARCH_BY_ENUM } from '../../helper/constants';
import { DefaultController } from '../../helper/custom-controller.decorator';
import { send as email } from '../../helper/email';
import { BadRequestError, NotAuthorizedError, NotFoundError, ServerError } from '../../helper/errors';
import { digestMessage } from '../../helper/hash';
import { log } from '../../helper/sentry';
import { UserFromRequest } from '../../helper/user.parameter.decorator';
import { buildWhereCondition } from '../../helper/where-interval.util';
import { UserService } from '../../service/user.service';
import {
  ActivitiesDto,
  AuthDto,
  CreatePassDto,
  DeleteRoleDto,
  ForgotDto,
  GetRolesDto,
  GetUsersDto,
  SaveRoleDto,
  SaveUserDto,
  UpdateProfileDto,
} from './user.request';
import {
  GetUsersResponseDto,
  PermissionResponse,
  RoleResponseDto,
  UserPermissionResponseDto,
  UserResponseDto,
} from './user.response';

@DefaultController('/user', 'User')
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @ApiOperationGet(meSchema)
  @Get('me')
  async me(@Req() req: Request, @UserFromRequest() user: User): Promise<UserResponseDto> {
    if (!user) {
      throw new NotAuthorizedError();
    }

    const permissions: PermissionResponse[] = await this.userService.getUserPermissions(user.id);

    return new UserResponseDto({ ...user, permissions, roles: user.roles.map((a) => a.name) });
  }

  @ApiOperationPost(auth)
  @Post('auth')
  async auth(@Req() req: Request, @Body() body: AuthDto): Promise<UserResponseDto> {
    const password: string = digestMessage(body.password);
    const user: User = await User.findOne({
      attributes: ['id', 'name', 'email', 'active', 'locale', 'timezone'],
      include: {
        model: RoleUser,
        include: [Role],
      },
      where: {
        active: 1,
        email: body.login.toLowerCase().trim(),
        password: digestMessage(body.password),
      },
    });

    if (!user) {
      throw new NotAuthorizedError();
    }

    const token: string = digestMessage(body.login + password);

    const t = await sequelize.transaction();
    await User.update({ remember_token: token }, { where: { id: user.id }, transaction: t });
    req.user = user;
    await UserLog.add(USER_LOG_ACTIONS.SIGN_IN, req, t);
    await t.commit();

    return new UserResponseDto({ ...user, token, roles: user.roleUsers.map((a) => a.role.display_name) });
  }

  @ApiOperationGet(permission)
  @Get('permission')
  async permission(@Req() req: Request): Promise<UserPermissionResponseDto> {
    const token = req.headers['boauth'];
    if (!token) {
      throw new NotAuthorizedError();
    }

    const permissions_a = [];

    const user = await User.findOne({
      where: { remember_token: token },
      include: {
        model: Role,
        include: [Permission],
      },
    });
    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        permissions_a.push(permission.name);
      });
    });

    return {
      permission: [...new Set(permissions_a)],
    };
  }

  @ApiOperationPost(updateProfile)
  @Post('update-profile')
  async updateProfile(@Req() req: Request, @Body() body: UpdateProfileDto): Promise<SuccessStatusResponse> {
    const token = req.headers['boauth'];
    const user: User = await User.findOne({
      where: {
        remember_token: token,
      },
    });

    if (!user) {
      throw new NotAuthorizedError();
    }

    const t = await sequelize.transaction();
    await User.update(
      {
        name: body.name,
        locale: body.locale,
        timezone: body.timezone,
      },
      { where: { id: user.id }, transaction: t },
    );
    req.user = user;
    await UserLog.add(USER_LOG_ACTIONS.UPDATE_PROFILE, req, t);
    await t.commit();

    return { message: 'OK' };
  }

  @ApiOperationPost(forgot)
  @Post('forgot')
  async forgot(@Req() req: Request, @Body() body: ForgotDto): Promise<SuccessStatusResponse> {
    const user: User = await User.findOne({
      where: {
        email: body.login.toLowerCase().trim(),
      },
    });

    if (!user) {
      throw new NotAuthorizedError();
    }

    const token: string = digestMessage(user.email + Math.floor(Math.random() * 99999));

    const t = await sequelize.transaction();
    await User.update({ forgot_pass: token }, { where: { id: user.id }, transaction: t });
    req.user = user;
    await UserLog.add(USER_LOG_ACTIONS.FORGOT_PASS, req, t);
    await t.commit();

    email(
      user.email,
      'reset password',
      "Reset password link:<br><a href='" +
        process.env.FRONT_HOST +
        user.locale +
        '/forgot-pass/reset?token=' +
        token +
        "'>Link</a>",
    );

    return { message: 'OK' };
  }

  @ApiOperationPost(createPass)
  @Post('create-pass')
  async createPass(@Req() req: Request, @Body() body: CreatePassDto): Promise<SuccessStatusResponse> {
    const user: User = await User.findOne({
      where: {
        forgot_pass: body.token.toLowerCase().trim(),
      },
    });

    if (!user) {
      throw new NotAuthorizedError();
    }

    body.password = digestMessage(body.password);

    const t = await sequelize.transaction();
    await User.update(
      {
        forgot_pass: null,
        remember_token: null,
        password: body.password,
      },
      { where: { id: user.id }, transaction: t },
    );
    req.user = user;
    await UserLog.add(USER_LOG_ACTIONS.UPDATE_PASS, req, t);
    await t.commit();

    return { message: 'OK' };
  }

  @ApiOperationPost(getUsers)
  @Post('users')
  async getUsers(@Body() body: GetUsersDto): Promise<GetUsersResponseDto> {
    const page = body.page || 1;
    const perPage = body.per_page || config.DEFAULT_PAGINATION_SIZE;

    const where: any = {};

    if (isNumber(body.active)) {
      where.active = body.active;
    }
    if (body.roles) {
      where['$"roleUsers"."role_id"$'] = {
        [Op.in]: body.roles,
      };
    }
    if (body.search) {
      where[Op.or] = [
        { email: { [Op.iLike]: `%${body.search}%` } },
        { name: { [Op.iLike]: `%${body.search}%` } },
        sequelize.where(sequelize.cast(sequelize.col('User.id'), 'varchar'), { [Op.iLike]: `%${body.search}%` }),
      ];
    }

    const count = await User.count({
      distinct: true,
      include: {
        model: RoleUser,
      },
      where: where,
    });

    const rows = await findAndParseUserResponseDtos(where, perPage, (page - 1) * perPage);

    if (!rows.length) {
      return {
        rows: [],
        pages: 1,
        current_page: 1,
      };
    }

    return {
      rows,
      pages: Math.ceil(count / perPage),
      current_page: page,
    };
  }

  @ApiOperationGet(getUser)
  @Get('')
  async getUser(@QueryParam('id') id: number): Promise<UserResponseDto> {
    const result = await findAndParseUserResponseDtos({ id });

    if (!result.length) {
      throw new NotFoundError('User is not found');
    }
    return result[0];
  }

  @ApiOperationPost(getPermissions)
  @Post('permissions')
  async getPermissions(@Body() body: GetRolesDto): Promise<GetPermissionsResponseDto> {
    const page = body.page || 1;
    const perPage = body.per_page || config.DEFAULT_PAGINATION_SIZE;

    const count = await Permission.count();
    const permissions = await Permission.findAll({ limit: perPage, offset: (page - 1) * perPage, order: ['name'] });

    return {
      rows: permissions.map((p) => new PermissionResponse(p)),
      pages: Math.ceil(count / perPage),
      current_page: page,
    };
  }

  @ApiOperationPost(getRoles)
  @Post('roles')
  async getRoles(@Body() body: GetRolesDto): Promise<GetRolesResponseDto> {
    const page = body.page || 1;
    const perPage = body.per_page || config.DEFAULT_PAGINATION_SIZE;
    const name = body.name;

    const where: WhereOptions = {};

    if (name) {
      where.name = {
        [Op.like]: `%${name.toLowerCase().trim()}%`,
      };
    }

    const count = await Role.count({ where });
    const roles = await Role.findAll({
      where,
      include: {
        model: PermissionRole,
        include: [Permission],
      },
      limit: perPage,
      offset: (page - 1) * perPage,
      raw: true,
      nest: true,
      order: [['id', 'ASC']],
    });

    const rows: RoleResponseDto[] = roles.reduce((prev: RoleResponseDto[], curr: any) => {
      const alreadyReduced = prev.find((row) => row.id === curr.id);

      const permission = new PermissionResponse(curr.permissionRoles.permission);

      if (!alreadyReduced) {
        const permissions = [];
        if (permission.id) {
          permissions.push(permission);
        }
        return prev.concat(
          new RoleResponseDto({
            id: curr.id,
            name: curr.name,
            display_name: curr.display_name,
            permissions,
          }),
        );
      }

      if (permission.id) {
        alreadyReduced.permissions.push(permission);
      }
      return prev;
    }, []);

    return {
      rows,
      pages: Math.ceil(count / perPage),
      current_page: page,
    };
  }

  @ApiOperationPost(saveRole)
  @Post('roles/save')
  async saveRole(@Req() req: Request, @Body() body: SaveRoleDto): Promise<SuccessStatusResponse> {
    const errors = [];
    if (!body.name) {
      errors.push({ property: 'name', constraints: ['required'] });
    }
    if (!body.permissions) {
      errors.push({ property: 'permissions', constraints: ['required'] });
    }
    if (!Array.isArray(body.permissions)) {
      errors.push({ property: 'permissions', constraints: ['is_array'] });
    }
    if (errors.length) {
      throw new BadRequestError('Data validation failed', errors);
    }

    const permissionIds = body.permissions;
    delete body.permissions;
    body.name = body.name.toLowerCase().trim();

    const t = await sequelize.transaction();
    if (!body.id) {
      try {
        const role = await Role.create(body as any, { transaction: t });
        for (let i = 0; i < permissionIds.length; i++) {
          await PermissionRole.create(
            {
              permission_id: permissionIds[i],
              role_id: role.id,
            },
            { transaction: t },
          );
        }
        await UserLog.add(USER_LOG_ACTIONS.ROLE_CREATE, req, t);
        await t.commit();
        return { message: 'OK' };
      } catch (err) {
        await t.rollback();
        if (err.name === 'SequelizeUniqueConstraintError') {
          throw new BadRequestError('Such values already exists', [
            { property: 'name', constraints: ['unique'] },
            { property: 'display_name', constraints: ['unique'] },
          ]);
        }
        log(err);
        throw new ServerError('Role creation failed');
      }
    }

    const role = await Role.findByPk(body.id);
    if (!role) {
      throw new NotFoundError('Role not found');
    }

    try {
      await Role.update(body, {
        where: {
          id: body.id,
        },
        transaction: t,
      });
      const rolePermissions = await role.getPermissionRoles();
      const permissionsToAdd = permissionIds.filter(
        (permissionId) => !rolePermissions.find((rolePermission) => rolePermission.permission_id === permissionId),
      );
      const rolePermissionsToDelete = rolePermissions.filter(
        (rolePermission) => !permissionIds.includes(rolePermission.permission_id),
      );

      for (let i = 0; i < rolePermissionsToDelete.length; i++) {
        await PermissionRole.destroy({
          where: {
            permission_id: rolePermissionsToDelete[i].permission_id,
            role_id: rolePermissionsToDelete[i].role_id,
          },
          transaction: t,
        });
      }
      for (let i = 0; i < permissionsToAdd.length; i++) {
        await PermissionRole.create(
          {
            permission_id: permissionsToAdd[i],
            role_id: role.id,
          },
          { transaction: t },
        );
      }
      await UserLog.add(USER_LOG_ACTIONS.ROLE_UPDATE, req, t);
      await t.commit();
    } catch (err) {
      await t.rollback();
      if (err.name === 'SequelizeUniqueConstraintError') {
        const errors = [];
        Object.keys(err.fields).forEach((property) => {
          errors.push({ property, constraints: ['unique'] });
        });
        throw new BadRequestError('Such value already exists', errors);
      }
      log(err);
      throw new ServerError('Role update failed');
    }
    return { message: 'OK' };
  }

  @ApiOperationPost(deleteRole)
  @Post('roles/delete')
  async deleteRole(@Req() req: Request, @Body() body: DeleteRoleDto): Promise<SuccessStatusResponse> {
    const role = await Role.findByPk(body.id);
    if (!role) {
      return { message: 'OK' };
    }

    const t = await sequelize.transaction();

    try {
      await PermissionRole.destroy({ where: { role_id: role.id }, transaction: t });
      await RoleUser.destroy({ where: { role_id: role.id }, transaction: t });
      await role.destroy({ transaction: t });
      await UserLog.add(USER_LOG_ACTIONS.ROLE_DELETE, req, t);
      await t.commit();
    } catch (err) {
      await t.rollback();
      log(err);
      throw new ServerError('Role deletion failed');
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(saveUser)
  @Post('users/save')
  async saveUser(@Req() req: Request, @Body() body: SaveUserDto): Promise<UserResponseDto> {
    let temp_pass: string | boolean = false;
    if (body.password) {
      temp_pass = body.password;
      body.password = digestMessage(body.password);
    }
    let roleIds = body.roles;
    delete body.roles;

    const t = await sequelize.transaction();
    if (!body.id) {
      const errors = [];
      if (!body.email) {
        errors.push({ property: 'email', constraints: ['required'] });
      }
      if (!body.password) {
        errors.push({ property: 'password', constraints: ['required'] });
      }
      if (errors.length) {
        throw new BadRequestError('Data validation failed', errors);
      }

      body.email = body.email.toLowerCase().trim();

      try {
        const user = await User.create(
          {
            ...body,
            active: body.active || 0,
          },
          { transaction: t },
        );

        for (let i = 0; i < roleIds.length; i++) {
          await RoleUser.create(
            {
              role_id: roleIds[i],
              user_id: user.id,
            },
            { transaction: t },
          );
        }
        await UserLog.add(USER_LOG_ACTIONS.USER_CREATE, req, t);
        await t.commit();

        email(
          user.email,
          'Registration on ' + process.env.FRONT_HOST,
          "Hello! We registered you in <a href='" +
            process.env.FRONT_HOST +
            "'>admin panel</a>. Use your email and following password: " +
            temp_pass,
        );
        const result = await findAndParseUserResponseDtos({
          id: user.id,
        });

        return result[0];
      } catch (err) {
        await t.rollback();
        if (err.name === 'SequelizeUniqueConstraintError') {
          throw new BadRequestError('Such email already exists', [
            {
              property: 'email',
              constraints: ['unique'],
            },
          ]);
        }
        log(err);
        throw new ServerError('User creation failed');
      }
    }
    const user = await User.findByPk(body.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (body.email) {
      throw new BadRequestError('Data validation failed', [{ property: 'email', constraints: ['not_editable'] }]);
    }

    const userRoles = await user.getRoleUsers();
    if (body.active === 0) {
      roleIds = [];
    }
    const userRolesToDelete = userRoles.filter((userRole) => !roleIds.includes(userRole.role_id));
    const rolesToCreate = roleIds.filter((roleId) => !userRoles.find((userRole) => userRole.role_id === roleId));

    await User.update(body, {
      where: {
        id: user.id,
      },
      transaction: t,
    });
    for (let i = 0; i < userRolesToDelete.length; i++) {
      await RoleUser.destroy({
        where: {
          role_id: userRolesToDelete[i].role_id,
          user_id: userRolesToDelete[i].user_id,
        },
        transaction: t,
      });
    }
    for (let i = 0; i < rolesToCreate.length; i++) {
      await RoleUser.create(
        {
          role_id: rolesToCreate[i],
          user_id: user.id,
        },
        { transaction: t },
      );
    }
    await UserLog.add(USER_LOG_ACTIONS.USER_UPDATE, req, t);
    await t.commit();

    const result = await findAndParseUserResponseDtos({
      id: user.id,
    });
    return result[0];
  }

  @ApiOperationPost(activities)
  @Post('activities')
  async activities(@Req() req: Request, @Body() body: ActivitiesDto) {
    const where: any = {};

    const whereRole: any = {};

    if (body.id) {
      const action = await UserLog.findByPk(body.id, {
        attributes: ['id', 'url', 'method', 'ip', 'params', 'action', 'created_at'],
        include: {
          model: User,
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: Role,
              attributes: ['display_name', 'name'],
            },
          ],
        },
      });

      return action;
    }

    if (body.search) {
      if (body.search_by === USER_LOG_SEARCH_BY_ENUM.USER) {
        where[Op.or] = [
          sequelize.where(sequelize.cast(sequelize.col('user.id'), 'varchar'), { [Op.iLike]: `%${body.search}%` }),
          sequelize.where(sequelize.col('user.name'), { [Op.iLike]: `%${body.search}%` }),
          sequelize.where(sequelize.col('user.email'), { [Op.iLike]: `%${body.search}%` }),
        ];
      }

      if (body.search_by === USER_LOG_SEARCH_BY_ENUM.ACTION) {
        where.action = { [Op.iLike]: `%${body.search}%` };
      }
    }

    const wherePeriod = buildWhereCondition(body.period, 'created_at');
    Object.assign(where, wherePeriod);

    if (body.role_id) {
      whereRole.role_id = { [Op.in]: castArray(body.role_id) };
    }

    const count = await UserLog.count({
      distinct: true,
      where,
      include: {
        model: User,
        required: true,
        include: [
          {
            model: RoleUser,
            required: true,
            where: whereRole,
          },
        ],
      },
    });

    const rows = await UserLog.findAll({
      attributes: ['id', 'action', 'created_at'],
      include: {
        model: User,
        required: true,
        attributes: ['id', 'name', 'email'],
        include: [
          {
            model: Role,
            attributes: ['display_name', 'name'],
          },
          { model: RoleUser, where: whereRole, required: true },
        ],
      },
      where,
      order: [
        ['id', 'DESC'],
        ['user', 'roles', 'id', 'ASC'],
      ],
      limit: body.per_page,
      offset: (body.page - 1) * body.per_page,
    });

    if (!rows.length) {
      return {
        rows: [],
        pages: 1,
        current_page: 1,
      };
    }

    return {
      rows,
      pages: Math.ceil(count / body.per_page),
      current_page: body.page,
    };
  }
}

const findAndParseUserResponseDtos = async (where, limit?: number, offset?: number) => {
  const usersResponse: any = await User.findAll({
    subQuery: false,
    attributes: ['id', 'name', 'email', 'active', 'locale', 'timezone'],
    include: {
      model: RoleUser,
      attributes: [],
      // include: [Role]
    },
    where,
    group: ['User.id'],
    order: [['active', 'DESC'], 'id'],
    limit,
    offset,
    // raw: true,
    // nest: true
  });
  if (usersResponse.length === 0) {
    return [];
  }
  const roles = await RoleUser.findAll({
    include: {
      model: Role,
    },
    where: {
      user_id: usersResponse.map((u) => u.id),
    },
  });

  const userLogs = await UserLog.findAll({
    attributes: [pkg.literal('DISTINCT ON (user_id) 1'), ...Object.keys(UserLog.rawAttributes)] as any,
    where: {
      user_id: usersResponse.map((u) => u.id),
    },
    order: ['user_id', ['created_at', 'DESC']],
  });

  for (const key in usersResponse) {
    usersResponse[key] = usersResponse[key].get({ plain: true });
    const userLog = userLogs.find((uL) => uL.user_id === usersResponse[key].id);
    // const userLog = roles.find(uR => uR.user_id === usersResponse[key].id);
    usersResponse[key].roles = roles
      .filter((uR) => uR.user_id === usersResponse[key].id)
      .map((obj) => {
        if (obj.role) {
          return {
            display_name: obj.role.display_name,
            name: obj.role.name,
            id: obj.role.id,
          };
        }
      });
    usersResponse[key].last_activity = userLog
      ? {
          action: userLog.action,
          timestamp: new Date(userLog.created_at).getTime(),
        }
      : null;
  }

  return usersResponse;
};
