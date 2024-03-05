import { Body, Post, Req } from 'routing-controllers';
import { ApiOperationPost } from 'swagger-express-ts';

import { Request } from 'express';
import { Inject } from 'typedi';
import {
  deleteCmsFooterValidator,
  getCmsFooterValidator,
  saveCmsFooterValidator,
} from '../../../swagger/operations/cms-footer';
import { UserLog } from '../../db/models';

import sequelize from '../../db';
import {
  GetByCmsFooterBlockDto,
  GetCmsFooterValidatorResponseDto,
  SaveCmsFooterValidatorBlockDto,
  SuccessStatusResponse,
} from '../../dto';
import { DeleteByIdDto } from '../../dto/response/shared';
import { USER_LOG_ACTIONS } from '../../helper/constants';
import { DefaultController } from '../../helper/custom-controller.decorator';
import { SaveError } from '../../helper/errors';
import { log } from '../../helper/sentry';
import { CmsService } from '../../service/cms.service';

@DefaultController('/cms-footer/block-content', 'CMS Footer Block content')
export class CmsFooterBlockValidatorController {
  @Inject()
  private readonly cmsService: CmsService;

  @ApiOperationPost(saveCmsFooterValidator)
  @Post('validator/save')
  async saveCmsFooterValidator(
    @Req() req: Request,
    @Body() body: SaveCmsFooterValidatorBlockDto,
  ): Promise<GetCmsFooterValidatorResponseDto> {
    const transaction = await sequelize.transaction();
    try {
      if (!body.id) {
        await this.cmsService.createCmsFooterValidator(body, transaction);
        await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_VALIDATOR_CREATE, req, transaction);
      } else {
        await this.cmsService.updateCmsFooterValidator(body, transaction);
        await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_VALIDATOR_UPDATE, req, transaction);
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      log(err);
      throw new SaveError(err.message);
    }

    return this.cmsService.getCmsFooterValidator(body.cms_footer_block_id);
  }

  @ApiOperationPost(getCmsFooterValidator)
  @Post('validator')
  async getCmsFooterValidator(@Body() body: GetByCmsFooterBlockDto): Promise<GetCmsFooterValidatorResponseDto> {
    return this.cmsService.getCmsFooterValidator(body.cms_footer_block_id);
  }

  @ApiOperationPost(deleteCmsFooterValidator)
  @Post('validator/delete')
  async deleteCmsFooterValidator(@Req() req: Request, @Body() body: DeleteByIdDto): Promise<SuccessStatusResponse> {
    const transaction = await sequelize.transaction();
    try {
      await this.cmsService.deleteCmsFooterValidator(body.id, transaction);
      await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_VALIDATOR_DELETE, req, transaction);

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      log(err);
      throw new SaveError(err.message);
    }

    return { message: 'OK' };
  }
}
