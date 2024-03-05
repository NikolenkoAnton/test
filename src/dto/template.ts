import { IsEnum, IsJSON, IsNumber, IsOptional } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

export enum hasTemplateValues {
  YES = 'yes',
  NO = 'no',
}

@ApiModel({
  name: 'GetMarketsDto',
  description: 'Filters to get markets list',
})
export class GetMarketsDto {
  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  per_page?: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  sport_id: number;

  @ApiModelProperty()
  @IsOptional()
  market_name: string;

  @ApiModelProperty()
  @IsOptional()
  br_id: string;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  market_group_id: number;

  @ApiModelProperty({
    example: hasTemplateValues.YES,
  })
  @IsOptional()
  @IsEnum(Object.values(hasTemplateValues))
  has_template: string;
}

@ApiModel({
  name: 'SearchMarketsDto',
})
export class SearchMarketsDto {
  @ApiModelProperty()
  search: string;
}

@ApiModel({
  name: 'UpdateMarketDto',
  description: 'Data to store, update or delete market',
})
export class UpdateMarketDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  template_id: number;

  @ApiModelProperty()
  @IsJSON()
  column: string;
}
