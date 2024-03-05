import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  name: 'SearchSportsResponse',
})
export class SearchSportsResponse {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  name: string;
}
