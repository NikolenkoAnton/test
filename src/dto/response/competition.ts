import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  name: 'SearchCompetitionsResponse',
})
export class SearchCompetitionsResponse {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  name: string;
}
