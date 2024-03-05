import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Sport, UserLog } from '../../db/models';
import TranslateLanguage from '../../db/models/TranslateLanguage';
import { ErrorsExposedData } from '../../helper/errors';
import { ErrorResponse } from '../../helper/responseBuilder';
import { Category as SSCategory, Competition as SSCompetition, Event, Sport as SSSport } from '../../lib/softswiss';
import {
  BetResponse,
  CurrencyDto,
  GetMarketsResponse,
  PermissionResponse,
  RoleResponseDto,
  SearchCompetitionsResponse,
  SearchGamesResponse,
  SearchMarketsResponse,
  SearchSportsResponse,
  TemplateResponse,
} from './index';
import { PaginationResponse } from './pagination';
import { TranslateKeyResponse } from './translate';

// ./response/template.ts:GetTemplatesResponse is impossible to decorate
// thus need to define model explicitly here
@ApiModel({
  description: 'Object that contains key-value structure of template objects (id: object)',
  name: 'SwaggerTemplatesResponseDto',
})
export class SwaggerTemplatesResponseDto {
  @ApiModelProperty({
    model: 'TemplateResponse',
  })
  '1': TemplateResponse;
}

// Paginated response models. Swagger decorators are not being inherited and exposed
// thus need to wrap and define each paginated response
@ApiModel({
  name: 'GetMarketsResponseDto',
  description: 'Paginated response of markets',
})
export class GetMarketsResponseDto extends PaginationResponse<GetMarketsResponse> {
  @ApiModelProperty({
    model: 'GetMarketsResponse',
  })
  rows: GetMarketsResponse[];

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
  name: 'SearchMarketsResponseDto',
  description: 'Response of markets search (first 50)',
})
export class SearchMarketsResponseDto extends PaginationResponse<SearchMarketsResponse> {
  @ApiModelProperty({
    model: 'SearchMarketsResponse',
  })
  rows: SearchMarketsResponse[];
}

@ApiModel({
  name: 'GetSportsResponseDto',
  description: 'Paginated response of sports',
})
export class GetSportsResponseDto extends PaginationResponse<Sport> {
  @ApiModelProperty({
    model: 'DBSport',
  })
  rows: Sport[];

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
  name: 'SearchSportsResponseDto',
  description: 'Response of sports search (first 50)',
})
export class SearchSportsResponseDto extends PaginationResponse<SearchSportsResponse> {
  @ApiModelProperty({
    model: 'SearchSportsResponse',
  })
  rows: SearchSportsResponse[];
}

@ApiModel({
  name: 'SearchCategoriesResponseDto',
  description: 'Response of categories search (first 50)',
})
export class SearchCategoriesResponseDto extends PaginationResponse<SearchCompetitionsResponse> {
  @ApiModelProperty({
    model: 'SearchCategoriesResponse',
  })
  rows: SearchCompetitionsResponse[];
}

@ApiModel({
  name: 'SearchGamesResponseDto',
  description: 'Response of games search (first 50)',
})
export class SearchGamesResponseDto extends PaginationResponse<SearchGamesResponse> {
  @ApiModelProperty({
    model: 'SearchGamesResponse',
  })
  rows: SearchGamesResponse[];
}

@ApiModel({
  name: 'GetSSSportsResponseDto',
  description: 'Response of sports list',
})
export class GetSSSportsResponseDto extends PaginationResponse<SSSport> {
  @ApiModelProperty({
    model: 'SoftswissSport',
  })
  rows: SSSport[];
}

@ApiModel({
  name: 'GetCategoriesResponseDto',
  description: 'Response of categories list',
})
export class GetCategoriesResponseDto extends PaginationResponse<SSCategory> {
  @ApiModelProperty({
    model: 'SoftswissCategory',
  })
  rows: SSCategory[];
}

@ApiModel({
  name: 'GetCompetitionsResponseDto',
  description: 'Response of categories list',
})
export class GetCompetitionsResponseDto extends PaginationResponse<SSCompetition> {
  @ApiModelProperty({
    model: 'SoftswissCompetition',
  })
  rows: SSCompetition[];
}

@ApiModel({
  name: 'GetEventResponseDto',
  description: 'Response of events list',
})
export class GetEventResponseDto extends PaginationResponse<Event> {
  @ApiModelProperty({
    model: 'SoftswissEvent',
  })
  rows: Event[];
}

@ApiModel({
  name: 'GetLanguagesResponseDto',
  description: 'Response of languages list',
})
export class GetLanguagesResponseDto extends PaginationResponse<TranslateLanguage> {
  @ApiModelProperty({
    model: 'TranslateLanguage',
  })
  rows: TranslateLanguage[];
}

@ApiModel({
  name: 'GetTranslateKeysResponseDto',
  description: 'Paginated response of localization keys',
})
export class GetTranslateKeysResponseDto extends PaginationResponse<TranslateKeyResponse> {
  @ApiModelProperty({
    model: 'TranslateKeyResponse',
  })
  rows: TranslateKeyResponse[];

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
  name: 'GetTranslateKeysGroupsResponseDto',
  description: 'Response of localization keys groups',
})
export class GetTranslateKeysGroupsResponseDto extends PaginationResponse<string> {
  @ApiModelProperty()
  rows: string[];
}

@ApiModel({
  name: 'GetPermissionsResponseDto',
  description: 'Response of roles list',
})
export class GetPermissionsResponseDto extends PaginationResponse<PermissionResponse> {
  @ApiModelProperty({
    model: 'PermissionResponseDto',
  })
  rows: PermissionResponse[];

  @ApiModelProperty({
    description: 'Total pages',
  })
  pages?: number;

  @ApiModelProperty({
    description: 'Current page',
  })
  current_page?: number;

  constructor(data) {
    super(data);
    this.pages = data?.pages;
    this.current_page = data?.current_page;
    this.rows = data?.rows.map((p) => new PermissionResponse(p));
  }
}

@ApiModel({
  name: 'GetRolesResponseDto',
  description: 'Response of roles list',
})
export class GetRolesResponseDto extends PaginationResponse<RoleResponseDto> {
  @ApiModelProperty({
    model: 'RoleResponseDto',
  })
  rows: RoleResponseDto[];

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
  name: 'GetUserLogsResponseDto',
  description: 'Paginated response of user logs',
})
export class GetUserLogsResponseDto extends PaginationResponse<UserLog> {
  @ApiModelProperty({
    model: 'UserLog',
  })
  rows: UserLog[];

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
  name: 'GetBetsResponseDto',
  description: 'Paginated response of bets',
})
export class GetBetsResponseDto extends PaginationResponse<BetResponse> {
  @ApiModelProperty({
    model: 'BetResponseDto',
  })
  rows: BetResponse[];

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
  name: 'GetCurrenciesResponseDto',
  description: 'Response with currencies list',
})
export class GetCurrenciesResponseDto extends PaginationResponse<CurrencyDto> {
  @ApiModelProperty({
    model: 'CurrencyDto',
  })
  rows: CurrencyDto[];
}

// Any error response (ErrorResponseDto)
@ApiModel({
  name: 'ErrorsData',
  description: 'Happened errors details',
})
class ErrorsDataResponse implements ErrorsExposedData {
  @ApiModelProperty({
    description: 'Request params',
  })
  target: {
    [key: string]: string;
  };

  @ApiModelProperty({
    description: 'Value that raised an error',
    type: 'string | number | null',
  })
  value?: string | number | null;

  @ApiModelProperty({
    description: 'Property that raised an error',
  })
  property: string;

  @ApiModelProperty({
    description: 'Children errors if any',
  })
  children: any[];

  @ApiModelProperty({
    description: 'Violated rules',
  })
  constraints: {
    [key: string]: string;
  };
}

@ApiModel({
  name: 'ErrorData',
})
class ErrorData {
  @ApiModelProperty()
  httpCode: number; // result code

  @ApiModelProperty()
  name: string; // name of the error

  @ApiModelProperty()
  message: string; // message

  @ApiModelProperty({
    model: 'ErrorsData',
  })
  errors: ErrorsExposedData[];
}

@ApiModel({
  name: 'ErrorResponseDto',
})
export class ErrorResponseDto implements ErrorResponse {
  @ApiModelProperty({
    model: 'ErrorData',
  })
  ERROR: ErrorData;
}
