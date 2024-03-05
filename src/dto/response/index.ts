import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

export * from './translate';
export * from './template';
export * from '../../controller/user/user.response';
export * from './.';
export * from './data';
export * from './category';
export * from './competition';
export * from './game';
export * from './currency';
export * from './widget';
export * from './cms';
export * from './swagger-specific';
export * from './cms-footer';
export * from './settings';
export * from './cms-footer';
export * from './cms-header';
export * from './burger';
export * from './rmt';
export * from '../../controller/bet/bet.response';
@ApiModel({
  name: 'SuccessStatusResponse',
  description: 'Successful status response',
})
export class SuccessStatusResponse {
  @ApiModelProperty({
    example: 'OK',
  })
  message: 'OK';
}

export const DEFAULT_SUCCESS_RESPONSE: SuccessStatusResponse = { message: 'OK' };
