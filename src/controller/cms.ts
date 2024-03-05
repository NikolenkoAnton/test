import ms from 'ms';
import { Body, Get, Post, QueryParams, Req, UploadedFile } from 'routing-controllers';
import { ApiOperationGet, ApiOperationPost } from 'swagger-express-ts';
import { Inject } from 'typedi';

import { Request } from 'express';
import pkg, { Op, WhereOptions } from 'sequelize';
import {
  choosePreviousImages,
  choosePreviousImagesMultipleRecords,
  choosePreviousImagesValues,
  deleteCmsPublicFile,
  deletePage,
  deletePreviousImages,
  deleteStaticPage,
  getCmsPublicFile,
  getCmsSportList,
  getGeneralSeo,
  getOneStaticPage,
  getPage,
  getPages,
  getPreviousImages,
  getStaticPage,
  getStaticPageTemplate,
  orderCmsSportList,
  patchStaticPage,
  saveCmsPublicFile,
  saveGeneralSeo,
  savePage,
  saveStaticPage,
} from '../../swagger/operations/cms';
import config from '../config';
import sequelize from '../db';
import { CmsImage, CmsImageItem, StaticPage, StaticPageTemplate, UserLog } from '../db/models';
import CmsGeneralSeo from '../db/models/CmsGeneralSeo';
import CmsPage from '../db/models/CmsPage';
import StaticPageValue from '../db/models/StaticPageValue';
import {
  ChoosePreviousImagesDto,
  ChoosePreviousImagesMultipleRecordsDto,
  ChoosePreviousImagesValuesDto,
  DEFAULT_SUCCESS_RESPONSE,
  DeletePageDto,
  DeletePreviousImagesDto,
  DeleteStaticPageDto,
  GetGeneralSeoResponseDto,
  GetPageDto,
  GetPagesDto,
  GetPagesResponseDto,
  GetPreviousImagesDto,
  GetPreviousImagesResponseDto,
  GetPublicFileResponseDto,
  GetSportListDto,
  GetStaticPageDto,
  GetStaticPageResponseDto,
  GetStaticPageTemplateResponseDto,
  GetTeaserDto,
  OrderSportListDataDto,
  OrderSportListDto,
  PatchActiveDto,
  QueryWithId,
  SaveCmsFile,
  SaveGeneralSeoDto,
  SavePageDto,
  SaveStaticPageDto,
  SuccessStatusResponse,
} from '../dto';
import { MAX_PUBLIC_FILE_SIZE, USER_LOG_ACTIONS } from '../helper/constants';
import { DefaultController } from '../helper/custom-controller.decorator';
import { BadRequestError, NotFoundError, SaveError, ServerError } from '../helper/errors';
import { patchManyEntities } from '../helper/patch';
import { log } from '../helper/sentry';
import { CmsService } from '../service/cms.service';
import { SettingsService } from '../service/settings.service';

@DefaultController('/cms', 'CMS')
export class CmsController {
  @Inject()
  private readonly cmsService: CmsService;

  @Inject()
  private readonly settingsService: SettingsService;

  @ApiOperationGet(getGeneralSeo)
  @Get('general-seo')
  async getGeneralSeo(): Promise<GetGeneralSeoResponseDto> {
    const rows = await CmsGeneralSeo.findAll({
      order: [
        ['block', 'ASC'],
        ['key', 'ASC'],
      ],
    });

    if (!rows.length) {
      return {
        rows: [],
      };
    }

    return {
      rows,
    };
  }

  @ApiOperationPost(saveGeneralSeo)
  @Post('general-seo/save')
  async saveGeneralSeo(@Req() req: Request, @Body() body: SaveGeneralSeoDto): Promise<SuccessStatusResponse> {
    const t = await sequelize.transaction();
    try {
      await CmsGeneralSeo.destroy({
        where: {},
        truncate: true,
        transaction: t,
      });

      for (const row of body.data) {
        await CmsGeneralSeo.create(
          {
            site_domain_id: row.site_domain_id,
            block: row.block,
            key: row.key,
            value: row.value,
          },
          {
            transaction: t,
          },
        );
      }
      await UserLog.add(USER_LOG_ACTIONS.CMS_PAGE_DEFAULT, req, t);
      await t.commit();
    } catch (err) {
      log(err);
      await t.rollback();
      throw new ServerError('Save default pages failed');
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(getPages)
  @Post('pages')
  async getPages(@Body() body: GetPagesDto): Promise<GetPagesResponseDto> {
    const page = body.page || 1;
    const perPage = body.per_page || config.DEFAULT_PAGINATION_SIZE;
    const where: WhereOptions = {};

    if (body.search) {
      where.url = {
        [Op.iLike]: `%${body.search}%`,
      };
    }

    return await this.cmsService.getPages(where, page, perPage);
  }

  @ApiOperationPost(getPage)
  @Post('pages/get')
  async getPage(@Body() body: GetPageDto): Promise<CmsPage> {
    const page = await this.cmsService.getPage(body.id);

    if (!page) {
      throw new NotFoundError('Page is not found');
    }

    return page;
  }

  @ApiOperationPost(savePage)
  @Post('pages/save')
  async savePage(@Req() req: Request, @Body() body: SavePageDto): Promise<SuccessStatusResponse> {
    const t = await sequelize.transaction();
    try {
      await this.cmsService.checkPageUrl(body);
      if (body.id) {
        await this.cmsService.updatePage(body, t);
        await UserLog.add(USER_LOG_ACTIONS.CMS_UPDATE_PAGE, req, t);
      } else {
        await this.cmsService.createPage(body, t);
        await UserLog.add(USER_LOG_ACTIONS.CMS_SAVE_PAGE, req, t);
      }

      await t.commit();
    } catch (err) {
      log(err);
      await t.rollback();
      throw new SaveError(err.status ? err.message : 'Save Page failed');
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(deletePage)
  @Post('pages/delete')
  async deletePage(@Req() req: Request, @Body() body: DeletePageDto): Promise<SuccessStatusResponse> {
    const page = await CmsPage.findByPk(body.id);
    if (!page) {
      throw new NotFoundError();
    }

    const t = await sequelize.transaction();
    try {
      await this.cmsService.deletePage(page, t, req);
      await t.commit();
    } catch (err) {
      log(err);
      await t.rollback();
      throw new ServerError('Delete page failed');
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(getPreviousImages)
  @Post('previous-images')
  async getPreviousImages(@Body() body: GetPreviousImagesDto): Promise<GetPreviousImagesResponseDto> {
    const where: WhereOptions = {
      section: body.section,
    };

    if (body.search) {
      where.name = {
        [Op.iLike]: `%${body.search}%`,
      };
    }

    const cmsImages = await CmsImage.findAll({
      attributes: {
        include: [[pkg.fn('COUNT', pkg.col('cmsImageItem.id')), 'itemCount']],
      },
      include: [
        {
          model: CmsImageItem,
          attributes: [],
        },
      ],
      where: where,
      group: ['CmsImage.id'],
      order: [['id', 'ASC']],
    });

    return { rows: cmsImages };
  }

  @ApiOperationPost(choosePreviousImages)
  @Post('previous-images/choose')
  async choosePreviousImages(
    @Req() req: Request,
    @Body() body: ChoosePreviousImagesDto,
  ): Promise<SuccessStatusResponse> {
    await this.cmsService.relatePreviousImageWithEntity(body);
    await UserLog.add(USER_LOG_ACTIONS.CMS_CHOOSE_IMG, req);

    return { message: 'OK' };
  }

  @ApiOperationPost(choosePreviousImagesValues)
  @Post('previous-images/choose-multiple')
  async choosePreviousImagesForValues(
    @Req() req: Request,
    @Body() body: ChoosePreviousImagesValuesDto,
  ): Promise<SuccessStatusResponse> {
    await this.cmsService.relatePreviousImageWithEntityValues(body);
    await UserLog.add(USER_LOG_ACTIONS.CMS_CHOOSE_IMG, req);

    return { message: 'OK' };
  }

  @ApiOperationPost(choosePreviousImagesMultipleRecords)
  @Post('previous-images/choose-multiple-records')
  async chooseForManyPreviousImages(
    @Req() req: Request,
    @Body() body: ChoosePreviousImagesMultipleRecordsDto,
  ): Promise<SuccessStatusResponse> {
    await this.cmsService.relatePreviousImagesWithEntities(body);
    await UserLog.add(USER_LOG_ACTIONS.CMS_CHOOSE_IMG, req);

    return { message: 'OK' };
  }

  @ApiOperationPost(deletePreviousImages)
  @Post('previous-images/delete')
  async deletePreviousImages(
    @Req() req: Request,
    @Body() body: DeletePreviousImagesDto,
  ): Promise<SuccessStatusResponse> {
    await this.cmsService.deletePreviousImage(body.image_id);

    UserLog.add(USER_LOG_ACTIONS.CMS_DELETE_IMG, req);

    return { message: 'OK' };
  }

  @ApiOperationPost(saveStaticPage)
  @Post('static-page/save')
  async saveStaticPage(@Req() req: Request, @Body() body: SaveStaticPageDto): Promise<SuccessStatusResponse> {
    const slug = body.slug;
    const existedSlug = await StaticPage.findOne({ where: { slug } });
    const pageId = body.id;
    const pagePayload = {
      slug,
      template_id: body.template_id,
      active: body.active,
      title: body.title,
      delete_after: body.preview ? Date.now() + ms('7d') : null,
      schedule: body.schedule,
      schedule_start_date: body.schedule_start_date,
      schedule_start_time: body.schedule_start_time,
      schedule_finish_date: body.schedule_finish_date,
      schedule_finish_time: body.schedule_finish_time,
      display_for_logged_in: body.preview ? true : body.display_for_logged_in,
      display_for_not_logged_in: body.preview ? true : body.display_for_not_logged_in,
      custom_css: body.custom_css,
    };

    const t = await sequelize.transaction();
    try {
      const defaultDomain = await this.settingsService.getDefaultDomain();
      if (!pageId) {
        await this.cmsService.createStaticPage(body, existedSlug, defaultDomain, pagePayload, t);
        await UserLog.add(USER_LOG_ACTIONS.STATIC_PAGE_CREATE, req, t);
      } else {
        await this.cmsService.updateStaticPage(body, existedSlug, defaultDomain, pagePayload, t);
        await UserLog.add(USER_LOG_ACTIONS.STATIC_PAGE_UPDATE, req, t);
      }

      await t.commit();
    } catch (err) {
      log(err);
      await t.rollback();
      throw new SaveError(`Save static page failed. ${err.message}`);
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(patchStaticPage)
  @Post('static-page/patchMany')
  async patchStaticPages(@Req() req: Request, @Body() body: PatchActiveDto): Promise<SuccessStatusResponse> {
    try {
      await patchManyEntities(StaticPage, body.data);
      await UserLog.add(USER_LOG_ACTIONS.MAIN_BANNER_SLIDE_UPDATE, req);
    } catch (err) {
      log(err);
      throw new SaveError();
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(getStaticPage)
  @Post('static-page')
  async getStaticPage(@Req() req: Request, @Body() body: GetStaticPageDto): Promise<GetStaticPageResponseDto> {
    const page = body.page || 1;
    const perPage = body.per_page || config.DEFAULT_PAGINATION_SIZE;
    const where = {
      delete_after: null,
    };
    if (body.search) {
      where['title'] = {
        [Op.iLike]: `%${body.search}%`,
      };
    }

    return await this.cmsService.getStaticPage(where, page, perPage);
  }

  @ApiOperationGet(getOneStaticPage)
  @Get('static-page/get')
  async getOneStaticPage(@QueryParams() data: QueryWithId): Promise<StaticPage> {
    const result = await this.cmsService.getOneStaticPage(data.id);

    return result;
  }

  @ApiOperationPost(deleteStaticPage)
  @Post('static-page/delete')
  async deleteStaticPage(@Req() req: Request, @Body() body: DeleteStaticPageDto): Promise<SuccessStatusResponse> {
    const page = await StaticPage.findByPk(body.id);
    if (!page) {
      throw new NotFoundError();
    }

    const t = await sequelize.transaction();
    try {
      await StaticPageValue.destroy({ where: { cms_static_page_id: body.id }, transaction: t });
      await StaticPage.destroy({ where: { id: body.id }, transaction: t });
      await UserLog.add(USER_LOG_ACTIONS.STATIC_PAGE_DELETE, req, t);
      await t.commit();
    } catch (err) {
      log(err);
      throw new ServerError('Delete static page failed');
    }

    return { message: 'OK' };
  }

  @ApiOperationGet(getStaticPageTemplate)
  @Get('static-page/template')
  async getStaticPageTemplates(): Promise<GetStaticPageTemplateResponseDto> {
    const data = await StaticPageTemplate.findAll({ order: [['id', 'ASC']] });
    return { rows: data };
  }

  @ApiOperationPost(saveCmsPublicFile)
  @Post('public-file/save')
  async saveCmsFile(
    @Req() req: Request,
    @Body() body: SaveCmsFile,
    @UploadedFile('file', {
      options: {
        limits: { fileSize: MAX_PUBLIC_FILE_SIZE },
      },
    })
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestError('file is required');
    }
    this.cmsService.publicFilesValidation(file);

    const t = await sequelize.transaction();
    try {
      await this.cmsService.createCmsFile(body, file, t);
      await UserLog.add(USER_LOG_ACTIONS.CMS_PUBLIC_FILE_CREATE, req, t);

      await t.commit();
    } catch (err) {
      log(err);
      await t.rollback();
      throw new SaveError(`Create cms file failed. ${err.message}`);
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(getCmsPublicFile)
  @Post('public-file')
  async getPublicFiles(@Body() body: GetPagesDto): Promise<GetPublicFileResponseDto> {
    const page = body.page || 1;
    const perPage = body.per_page || config.DEFAULT_PAGINATION_SIZE;
    const where: WhereOptions = {};

    if (body.search) {
      where.name = {
        [Op.iLike]: `%${body.search}%`,
      };
    }

    let res;
    try {
      res = await this.cmsService.getPublicFiles(where, page, perPage);
    } catch (err) {
      log(err);
      throw new ServerError();
    }

    return res;
  }

  @ApiOperationPost(deleteCmsPublicFile)
  @Post('public-file/delete')
  async deletePublicFiles(@Req() req: Request, @Body() body: DeletePageDto): Promise<SuccessStatusResponse> {
    const t = await sequelize.transaction();
    try {
      await this.cmsService.deletePublicFile(body.id, t);
      await UserLog.add(USER_LOG_ACTIONS.CMS_PUBLIC_FILE_DELETE, req, t);
      await t.commit();
    } catch (err) {
      log(err);
      await t.rollback();
      throw new ServerError('Delete public file failed');
    }

    return { message: 'OK' };
  }

  @ApiOperationGet(getCmsSportList)
  @Get('event-list')
  async getSportList(@Req() req: Request, @QueryParams() params: GetSportListDto): Promise<OrderSportListDataDto> {
    try {
      const res = await this.cmsService.getSportList(params);

      return res;
    } catch (err) {
      log(err);
      throw new ServerError();
    }
  }

  @ApiOperationPost(orderCmsSportList)
  @Post('event-list/save')
  async orderSportList(@Req() req: Request, @Body() body: OrderSportListDto): Promise<SuccessStatusResponse> {
    try {
      await this.cmsService.orderSportList(body.data);

      return DEFAULT_SUCCESS_RESPONSE;
    } catch (err) {
      log(err);
      throw new ServerError();
    }
  }
}
