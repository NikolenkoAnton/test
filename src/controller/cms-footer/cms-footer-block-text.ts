import { Body, Post, Req } from 'routing-controllers';
import { ApiOperationPost } from 'swagger-express-ts';

import { Request } from 'express';
import { Inject } from 'typedi';
import {
  getCmsFooterTexts,
  removeCmsFooterTexts,
  saveCmsFooterTextBlockItem,
} from '../../../swagger/operations/cms-footer';
import sequelize from '../../db';
import { UserLog } from '../../db/models';

import { ValidationError } from 'sequelize';
import {
  GetByCmsFooterBlockDto,
  GetCmsFooterTextResponseDto,
  RemoveCmsFooterTextDto,
  SaveCmsFooterTextBlockDto,
  SuccessStatusResponse,
} from '../../dto';
import { USER_LOG_ACTIONS } from '../../helper/constants';
import { DefaultController } from '../../helper/custom-controller.decorator';
import { BadRequestError, SaveError, ServerError, handleSequilizeValidationErrorMessage } from '../../helper/errors';
import { log } from '../../helper/sentry';
import { CmsService } from '../../service/cms.service';

@DefaultController('/cms-footer/block-content', 'CMS Footer Block content')
export class CmsFooterBlockText {
  @Inject()
  private readonly cmsService: CmsService;

  //#region  Text block actions
  @ApiOperationPost(saveCmsFooterTextBlockItem)
  @Post('text/save')
  async saveCmsFooterTextBlockItem(
    @Req() req: Request,
    @Body() body: SaveCmsFooterTextBlockDto,
  ): Promise<GetCmsFooterTextResponseDto> {
    if (!body.id && !body.cms_footer_block_id) {
      throw new BadRequestError('id or cms_footer_block_id is required');
    }
    const { values } = body;

    const t = await sequelize.transaction();
    try {
      if (!body.id) {
        await this.cmsService.createCmsFooterTextBlockItem(values, body.cms_footer_block_id, t);
        await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_TEXT_CREATE, req, t);
      } else {
        await this.cmsService.updateCmsFooterTextBlockItem(values, body.id, t);
        await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_TEXT_UPDATE, req, t);
      }

      await t.commit();
    } catch (err) {
      await t.rollback();
      log(err);
      if (err instanceof ValidationError) {
        throw new SaveError(handleSequilizeValidationErrorMessage(err));
      }
      throw new SaveError(err.message);
    }

    return await this.cmsService.getCmsFooterTexts(body.id || body.cms_footer_block_id);
  }

  @ApiOperationPost(getCmsFooterTexts)
  @Post('text')
  async getCmsFooterText(@Body() body: GetByCmsFooterBlockDto): Promise<GetCmsFooterTextResponseDto> {
    return await this.cmsService.getCmsFooterTexts(body.cms_footer_block_id);
  }

  @ApiOperationPost(removeCmsFooterTexts)
  @Post('text/delete')
  async removeCmsFooterText(@Req() req: Request, @Body() body: RemoveCmsFooterTextDto): Promise<SuccessStatusResponse> {
    const t = await sequelize.transaction();

    try {
      await this.cmsService.removeCmsFooterTexts(body.id, t);
      await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_TEXT_DELETE, req, t);

      await t.commit();
    } catch (err) {
      await t.rollback();
      log(err);
      throw new ServerError('Text block delete failed');
    }

    return { message: 'OK' };
  }
  //#endregion
}
