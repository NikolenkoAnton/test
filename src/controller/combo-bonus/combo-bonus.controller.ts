import { Body, Delete, Get, Post, QueryParams } from 'routing-controllers';
import { ApiOperationDelete, ApiOperationGet, ApiOperationPost } from 'swagger-express-ts';
import { Inject } from 'typedi';
import {
  deleteComboBonusSchema,
  getComboBonusSchema,
  saveComboBonusSchema,
} from '../../../swagger/operations/combo-bonus';
import { User } from '../../db/models';
import { DefaultController } from '../../helper/custom-controller.decorator';
import { UserFromRequest } from '../../helper/user.parameter.decorator';
import { ComboBonusSaveRequest, DeleteComboBonusRequest, GetComboBonusRequest } from './combo-bonus.request';
import { ComboBonusService } from './combo-bonus.service';

@DefaultController('/combo-bonus', 'ComboBonus', [])
export class ComboBonusController {
  @Inject()
  private comboBonusService: ComboBonusService;

  @ApiOperationPost(saveComboBonusSchema)
  @Post('save')
  async saveComboBonus(@Body() data: ComboBonusSaveRequest, @UserFromRequest() user: User) {
    const response = data.id
      ? await this.comboBonusService.updateComboBonus(data)
      : await this.comboBonusService.saveComboBonus(data, user.id);

    return (response as any).toJSON();
  }

  @ApiOperationGet(getComboBonusSchema)
  @Get('')
  async getComboBonus(@QueryParams() data: GetComboBonusRequest) {
    const response = await this.comboBonusService.getComboBonus(data);
    return response;
  }

  @ApiOperationDelete(deleteComboBonusSchema)
  @Delete('delete')
  async deleteComboBonus(@Body() data: DeleteComboBonusRequest) {
    return this.comboBonusService.deleteComboBonus(data);
  }
}
