import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  name: 'BaseResponse',
})
export class BaseResponse {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  name: string;

  constructor(data?: { id: number; name: string }) {
    this.id = data.id;
    this.name = data.name;
  }
}
