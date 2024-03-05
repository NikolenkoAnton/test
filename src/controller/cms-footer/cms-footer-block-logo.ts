import { Body, Patch, Post, Req, UseBefore, UseInterceptor } from 'routing-controllers';
import { ApiOperationPost } from 'swagger-express-ts';

import { Request } from 'express';
import { Inject } from 'typedi';
import {
  deleteCmsFooterLogo,
  getCmsFooterLogo,
  patchFooterLogo,
  saveCmsFooterLogo,
} from '../../../swagger/operations/cms-footer';
import { UserLog } from '../../db/models';

import multer from 'multer';
import sequelize from '../../db';
import CmsFooterLogo from '../../db/models/CmsFooterLogo';
import {
  GetByCmsFooterBlockDto,
  GetCmsFooterLogoResponseDto,
  PatchActiveAndPositionDto,
  SaveCmsFooterLogoBlockDto,
  SuccessStatusResponse,
} from '../../dto';
import { DeleteByIdDto } from '../../dto/response/shared';
import { USER_LOG_ACTIONS } from '../../helper/constants';
import { DefaultController } from '../../helper/custom-controller.decorator';
import { SaveError } from '../../helper/errors';
import { patchManyEntities } from '../../helper/patch';
import { log } from '../../helper/sentry';
import { CmsService } from '../../service/cms.service';

@DefaultController('/cms-footer/block-content', 'CMS Footer Block content')
export class CmsFooterBlockLogoController {
  @Inject()
  private readonly cmsService: CmsService;

  //#region Logo block actions
  @ApiOperationPost(saveCmsFooterLogo)
  @UseBefore(
    multer({
      storage: multer.memoryStorage(),
    }).any(),
  )
  @UseInterceptor()
  @Post('logo/save')
  async saveCmsFooterLogo(
    @Req() req: Request,
    @Body() body: SaveCmsFooterLogoBlockDto,
  ): Promise<GetCmsFooterLogoResponseDto> {
    const files = req.files as any;

    if (files?.length) {
      this.cmsService.validateLogoFiles(files);
    }

    const t = await sequelize.transaction();
    try {
      if (!body.id) {
        await this.cmsService.createCmsFooterLogo(body, files, t);
        await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_LOGO_CREATE, req, t);
      } else {
        await this.cmsService.updateCmsFooterLogo(body, files, body.id, t);
        await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_LOGO_UPDATE, req, t);
      }

      await t.commit();
    } catch (err) {
      await t.rollback();
      log(err);
      throw new SaveError(err.message);
    }

    return this.cmsService.getCmsFooterLogo(body.cms_footer_block_id);
  }

  @ApiOperationPost(getCmsFooterLogo)
  @Post('logo')
  async getCmsFooterLogo(@Body() body: GetByCmsFooterBlockDto): Promise<GetCmsFooterLogoResponseDto> {
    return this.cmsService.getCmsFooterLogo(body.cms_footer_block_id);
  }

  @ApiOperationPost(deleteCmsFooterLogo)
  @Post('logo/delete')
  async deleteCmsFooterLogo(@Req() req: Request, @Body() body: DeleteByIdDto): Promise<SuccessStatusResponse> {
    const t = await sequelize.transaction();
    try {
      await this.cmsService.deleteCmsFooterLogo(body.id, t);
      await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_LOGO_DELETE, req, t);

      await t.commit();
    } catch (err) {
      await t.rollback();
      log(err);
      throw new SaveError(err.message);
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(patchFooterLogo)
  @Patch('logo/patchMany')
  async patchLogo(@Req() req: Request, @Body() body: PatchActiveAndPositionDto): Promise<SuccessStatusResponse> {
    const transaction = await sequelize.transaction();
    try {
      await patchManyEntities(CmsFooterLogo, body.data, transaction);
      await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_LOGO_UPDATE, req);
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      log(err);
      throw new SaveError(err.message);
    }

    return { message: 'OK' };
  }
  //#endregion
}
