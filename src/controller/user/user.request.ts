import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  MinLength,
  MaxLength,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import lodash from 'lodash';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import config from '../../config';
import { USER_LOG_SEARCH_BY_ENUM } from '../../helper/constants';
import { BOOLEAN_SMALLINT, DatetimeRange, PaginationRequest } from '../../dto/shared';
const { castArray } = lodash;

@ApiModel({
  description: 'Data to authenticate user',
  name: 'AuthDto',
})
export class AuthDto {
  @ApiModelProperty({
    description: 'Email of user',
    required: true,
  })
  @IsString()
  @IsEmail()
  login: string;

  @ApiModelProperty({
    description: 'Password of user',
    required: true,
  })
  @IsString()
  password: string;
}

@ApiModel({
  description: 'Data to authenticate user',
  name: 'UpdateProfileDto',
})
export class UpdateProfileDto {
  @ApiModelProperty({
    description: 'User name',
    required: true,
  })
  @IsString()
  name: string;

  @ApiModelProperty({
    description: 'Locale, example en',
    required: true,
  })
  @IsString()
  locale: string;

  @ApiModelProperty({
    description: 'User local timezone, example UTC',
    required: true,
  })
  @IsString()
  timezone: string;
}

@ApiModel({
  description: 'Data to password remainder user',
  name: 'ForgotDto',
})
export class ForgotDto {
  @ApiModelProperty({
    description: 'Email of user',
    required: true,
  })
  @IsString()
  @IsEmail()
  login: string;
}

@ApiModel({
  description: 'Data to update user password',
  name: 'CreatePassDto',
})
export class CreatePassDto {
  @ApiModelProperty({
    description: 'Token from email',
    required: true,
  })
  @IsString()
  token: string;

  @ApiModelProperty({
    description: 'New password',
    required: true,
  })
  @IsString()
  @MinLength(8, { message: 'Password should be minimum of 8 characters' })
  @MaxLength(64, { message: 'Password should be maximum of 64 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#!_?.\/\-+%”])[A-Za-z\d#!_?.\/\-+%”]+$/, {
    message: 'Password not valid',
  })
  password: string;
}

@ApiModel({
  name: 'GetUsersDto',
})
export class GetUsersDto {
  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  page?: number;
  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  per_page?: number;
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Search should be minimum of 3 characters' })
  @ApiModelProperty()
  search?: string;
  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  active?: number;
  @ApiModelProperty()
  @IsOptional()
  @IsNumber({}, { each: true })
  roles?: number[];
}

@ApiModel({
  name: 'SaveUserDto',
})
export class SaveUserDto {
  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  id?: number;
  @IsString()
  @ApiModelProperty()
  name: string;
  @IsOptional()
  @IsString()
  @IsEmail()
  @ApiModelProperty()
  email?: string;
  @IsOptional()
  @IsString()
  @ApiModelProperty()
  locale?: string;
  @IsOptional()
  @IsString()
  @ApiModelProperty()
  timezone?: string;
  @IsOptional()
  @IsString()
  @ApiModelProperty()
  @MinLength(8, { message: 'Password should be minimum of 8 characters' })
  @MaxLength(64, { message: 'Password should be maximum of 64 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#!_?.\/\-+%”])[A-Za-z\d#!_?.\/\-+%”]+$/, {
    message: 'Password not valid',
  })
  password?: string;
  @IsOptional()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  @ApiModelProperty()
  active?: number;
  @IsArray()
  @ApiModelProperty()
  roles: number[];
}

@ApiModel({
  name: 'DeleteUserDto',
})
export class DeleteUserDto {
  @IsNumber()
  @ApiModelProperty()
  id: number;
}

@ApiModel({
  name: 'GetLogsDto',
})
export class GetLogsDto extends PaginationRequest {
  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  user_id?: number;

  @IsOptional()
  @IsString({})
  @ApiModelProperty()
  action?: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  @ApiModelProperty()
  roles_ids?: number[];

  @ApiModelProperty({
    model: 'DatetimeRange',
  })
  @IsOptional()
  period?: DatetimeRange;

  @ApiModelProperty()
  @IsOptional()
  search?: string;
}

@ApiModel({
  name: 'GetPermissionsDto',
})
export class GetPermissionsDto {
  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  page?: number;
  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  per_page?: number;
}

@ApiModel({
  name: 'GetRolesDto',
})
export class GetRolesDto {
  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  page?: number;
  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  per_page?: number;
  @IsOptional()
  @IsString()
  @ApiModelProperty()
  name?: string;
}

@ApiModel({
  name: 'SaveRoleDto',
})
export class SaveRoleDto {
  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  id?: number;

  @IsOptional()
  @IsString()
  @ApiModelProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty()
  display_name?: string;

  @IsArray()
  @ApiModelProperty()
  permissions: number[];
}

@ApiModel({
  name: 'DeleteRoleDto',
})
export class DeleteRoleDto {
  @IsNumber()
  @ApiModelProperty()
  id: number;
}

@ApiModel({
  name: 'ActivitiesDto',
})
export class ActivitiesDto {
  @IsOptional()
  @IsNumber()
  @ApiModelProperty({ description: 'Action id' })
  id?: number;

  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  per_page?: number = config.DEFAULT_PAGINATION_SIZE;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Search should be minimum of 3 characters' })
  @ApiModelProperty()
  search?: string;

  @IsEnum(USER_LOG_SEARCH_BY_ENUM)
  @ApiModelProperty({ enum: Object.values(USER_LOG_SEARCH_BY_ENUM) })
  search_by?: USER_LOG_SEARCH_BY_ENUM = USER_LOG_SEARCH_BY_ENUM.USER;

  @ApiModelProperty({
    model: 'DatetimeRange',
  })
  @IsOptional()
  period?: DatetimeRange;

  @ApiModelProperty()
  @IsOptional()
  role_id?: number | number[];
}
