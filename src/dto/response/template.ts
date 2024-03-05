import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

class GetMarketsColumn {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  type: string;

  @ApiModelProperty()
  market_group_id: number;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  column_id: number;
}

@ApiModel({
  name: 'GetMarketsResponse',
})
export class GetMarketsResponse {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  sport_name: string;

  @ApiModelProperty()
  sport_id: number;

  @ApiModelProperty()
  provider_market_group_id: number;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  template_view_name: string;

  @ApiModelProperty()
  template_view_id: number;

  @ApiModelProperty({
    model: 'GetMarketsColumn',
  })
  column?: GetMarketsColumn[];
}

@ApiModel({
  name: 'SearchMarketsResponse',
})
export class SearchMarketsResponse {
  @ApiModelProperty()
  name: string;
}

@ApiModel({
  name: 'TemplateColumn',
})
class TemplateColumn {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  name: string;
}

@ApiModel({
  name: 'TemplateResponse',
})
export class TemplateResponse {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty({
    model: 'TemplateColumn',
  })
  column: TemplateColumn[];
}

export class GetTemplatesResponseDto {
  [key: number]: TemplateResponse;
}
