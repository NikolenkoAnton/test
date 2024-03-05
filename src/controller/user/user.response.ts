import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { PaginationResponse } from '../../dto/response/pagination';
import { assign, pick, keys } from 'lodash';

@ApiModel({
  name: 'UserResponseDto',
})
export class UserResponseDto {
  @ApiModelProperty()
  id: number = undefined;

  @ApiModelProperty()
  name: string = undefined;

  @ApiModelProperty()
  email: string = undefined;

  @ApiModelProperty()
  locale: string = undefined;

  @ApiModelProperty()
  timezone: string = undefined;

  @ApiModelProperty()
  active?: number = undefined;

  @ApiModelProperty({
    example: ['user-admin', 'admin-finance'],
  })
  roles: string[] = undefined;

  @ApiModelProperty({
    model: 'LastActivity',
  })
  last_activity?: {
    action: string;
    timestamp: number;
  } = undefined;

  @ApiModelProperty({ required: false })
  token?: string = undefined;

  @ApiModelProperty()
  permissions?: PermissionResponse[] = undefined;

  constructor(data?) {
    if (data) {
      assign(this, pick(data, keys(this)));
    }
  }
}

@ApiModel({
  description: 'List current user permission',
  name: 'UserPermissionResponseDto',
})
export class UserPermissionResponseDto {
  @ApiModelProperty({
    example: ['bet/bets', 'template/markets'],
  })
  permission: string[];
}

@ApiModel({
  name: 'LastActivity',
})
class LastActivity {
  @ApiModelProperty()
  action: string;
  @ApiModelProperty()
  timestamp: number;
}

@ApiModel({
  name: 'PermissionResponse',
})
export class PermissionResponse {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  display_name: string;

  @ApiModelProperty()
  path?: string;

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.display_name = data.display_name;
    this.path = data.path || data.name;
  }
}

@ApiModel({
  name: 'RoleResponseDto',
})
export class RoleResponseDto {
  @ApiModelProperty()
  id: number;
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  display_name: string;
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY,
    model: 'PermissionResponseDto',
  })
  permissions: PermissionResponse[];

  constructor(data?) {
    this.id = data?.id;
    this.name = data?.name;
    this.display_name = data?.display_name;
    this.permissions = data?.permissions?.map((p) => new PermissionResponse(p));
  }
}

@ApiModel({
  name: 'GetUsersResponseDto',
  description: 'Paginated response of users',
})
export class GetUsersResponseDto extends PaginationResponse<UserResponseDto> {
  @ApiModelProperty({
    model: 'UserResponseDto',
  })
  rows: UserResponseDto[];

  @ApiModelProperty({
    description: 'Total pages',
  })
  pages?: number;

  @ApiModelProperty({
    description: 'Current page',
  })
  current_page?: number;
}

@ApiModel({
  name: 'ActivityResponseDto',
})
export class ActivityResponseDto {
  @ApiModelProperty()
  id: number;
  @ApiModelProperty()
  user_id: number;
  @ApiModelProperty()
  action: string;
  @ApiModelProperty()
  ip: string;
  @ApiModelProperty()
  url: string;
  @ApiModelProperty()
  method: string;
  @ApiModelProperty()
  params: string;
  @ApiModelProperty()
  created_at: any;
  @ApiModelProperty({
    example: [
      {
        id: SwaggerDefinitionConstant.Model.Property.Type.INTEGER,
        name: SwaggerDefinitionConstant.Model.Property.Type.STRING,
        roles: SwaggerDefinitionConstant.Model.Property.Type.ARRAY,
      },
    ],
  })
  user?: any;
}

@ApiModel({
  name: 'ActivitiesResponseDto',
  description: 'Paginated response of activities',
})
export class ActivitiesResponseDto extends PaginationResponse<ActivityResponseDto> {
  @ApiModelProperty({
    model: 'ActivityResponseDto',
  })
  rows: ActivityResponseDto[];

  @ApiModelProperty({
    description: 'Total pages',
  })
  pages?: number;

  @ApiModelProperty({
    description: 'Current page',
  })
  current_page?: number;
}
