import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { BaseResponse } from '../../dto/response/common.response';
import { ComboBonusConditionRequest } from './combo-bonus.request';

@ApiModel({
  name: 'ComboBonusResponse',
})
export class ComboBonusResponse {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  values: object[];

  @ApiModelProperty()
  sport: BaseResponse;

  @ApiModelProperty()
  creator: BaseResponse;

  @ApiModelProperty({ model: 'ComboBonusCondition' })
  conditions: ComboBonusConditionRequest[];

  @ApiModelProperty()
  ggr: number;

  @ApiModelProperty()
  show_time: any;
}
