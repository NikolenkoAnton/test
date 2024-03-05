import { Type } from 'class-transformer';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { BurgerBlock } from '../../db/models';

@ApiModel({
  name: 'GetBurgerBlocksResponse',
})
export class GetBurgerBlocksResponse {
  @Type(() => BurgerBlock)
  @ApiModelProperty({ model: 'BurgerBlock' })
  rows: BurgerBlock[];
}
