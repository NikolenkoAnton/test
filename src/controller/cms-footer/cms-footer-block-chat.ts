import { Body, Post, Req } from 'routing-controllers';
import { ApiOperationPost } from 'swagger-express-ts';

import { Request } from 'express';
import { Inject } from 'typedi';
import { deleteCmsFooterChat, getCmsFooterChat, saveCmsFooterChat } from '../../../swagger/operations/cms-footer';
import { UserLog } from '../../db/models';

import sequelize from '../../db';
import {
  GetByCmsFooterBlockDto,
  GetCmsFooterChatResponseDto,
  SaveCmsFooterChatBlockDto,
  SuccessStatusResponse,
} from '../../dto';
import { DeleteByIdDto } from '../../dto/response/shared';
import { USER_LOG_ACTIONS } from '../../helper/constants';
import { DefaultController } from '../../helper/custom-controller.decorator';
import { SaveError } from '../../helper/errors';
import { log } from '../../helper/sentry';
import { CmsService } from '../../service/cms.service';

@DefaultController('/cms-footer/block-content', 'CMS Footer Block content')
export class CmsFooterBlockChatController {
  @Inject()
  private readonly cmsService: CmsService;

  @ApiOperationPost(saveCmsFooterChat)
  @Post('chat/save')
  async saveCmsFooterChat(
    @Req() req: Request,
    @Body() body: SaveCmsFooterChatBlockDto,
  ): Promise<GetCmsFooterChatResponseDto> {
    const transaction = await sequelize.transaction();
    try {
      if (!body.id) {
        await this.cmsService.createCmsFooterChat(body, transaction);
        await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_CHAT_CREATE, req, transaction);
      } else {
        await this.cmsService.updateCmsFooterChat(body, transaction);
        await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_CHAT_UPDATE, req, transaction);
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      log(err);
      throw new SaveError(err.message);
    }

    return this.cmsService.getCmsFooterChat(body.cms_footer_block_id);
  }

  @ApiOperationPost(getCmsFooterChat)
  @Post('chat')
  async getCmsFooterChat(@Body() body: GetByCmsFooterBlockDto): Promise<GetCmsFooterChatResponseDto> {
    return this.cmsService.getCmsFooterChat(body.cms_footer_block_id);
  }

  @ApiOperationPost(deleteCmsFooterChat)
  @Post('chat/delete')
  async deleteCmsFooterLogo(@Req() req: Request, @Body() body: DeleteByIdDto): Promise<SuccessStatusResponse> {
    const transaction = await sequelize.transaction();
    try {
      await this.cmsService.deleteCmsFooterChat(body.id, transaction);
      await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_CHAT_DELETE, req, transaction);

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      log(err);
      throw new SaveError(err.message);
    }

    return { message: 'OK' };
  }
}
