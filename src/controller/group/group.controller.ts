import { getGroupsSchema } from './../../../swagger/operations/group';
import { Body, Get, Post, QueryParams } from 'routing-controllers';
import { DefaultController } from '../../helper/custom-controller.decorator';
import { PlatformGroup, PlatformUserGroup } from '../../db/models';
import { ApiOperationGet, ApiOperationPost } from 'swagger-express-ts';
import { filter, map } from 'lodash';
import { Op, literal } from 'sequelize';

@DefaultController('/group', 'User Group', [], true)
export class GroupController {
  @ApiOperationGet(getGroupsSchema)
  @Get()
  async getGroups(@QueryParams() query: any) {
    const groupQuery: any = { order: [['name', 'ASC']] };

    if (query.search) {
      groupQuery.where = { [Op.and]: [literal(`LOWER(name) like '%'||LOWER('${query.search}')||'%'`)] };
    }

    const groups = await PlatformGroup.findAll(groupQuery);

    return map(groups, ({ id, name }) => ({ id, name }));
  }

  @Post()
  async createGroup(@Body() data: any) {
    let existGroup = await PlatformGroup.findOne({ where: { name: data.name } });

    if (!existGroup) {
      existGroup = await PlatformGroup.create({ name: data.name });
    }

    const groupUsers = await PlatformUserGroup.findAll({ where: { group_id: existGroup.id } });

    const userToInsert = map(
      filter(data.userIds, (userId) => !map(groupUsers, 'user_id').includes(userId)),
      (userId) => ({ user_id: userId, group_id: existGroup.id }),
    );

    await PlatformUserGroup.bulkCreate(userToInsert);

    return true;
  }
}
