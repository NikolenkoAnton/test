import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { IsNumber } from 'class-validator';

@ApiModel({
  name: 'TranslateLanguageResponse',
})
export class TranslateLanguageResponse {
  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  short: string;
}

@ApiModel({
  name: 'SiteDomainResponse',
})
export class SiteDomainResponse {
  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  url: string;
}

@ApiModel({
  name: 'DeleteByIdDto',
})
export class DeleteByIdDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;
}

@ApiModel({
  name: 'GetByIdDto',
})
export class GetByIdDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;
}
