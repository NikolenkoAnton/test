import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  name: 'SearchGamesResponse',
})
export class SearchGamesResponse {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  name: string;
}
