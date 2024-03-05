import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  name: 'CurrencyDto',
})
export class CurrencyDto {
  @ApiModelProperty()
  id: number;
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  name_plural: string;
  @ApiModelProperty()
  code: string;
  @ApiModelProperty()
  value: number;
}
