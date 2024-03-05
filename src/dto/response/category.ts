import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  name: 'SearchCategoriesResponse',
})
export class SearchCategoriesResponse {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  name: string;
}
