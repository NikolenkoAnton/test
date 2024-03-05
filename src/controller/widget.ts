import { Body, Get, Post, Req, UploadedFile, UploadedFiles } from 'routing-controllers';
import { ApiOperationGet, ApiOperationPost } from 'swagger-express-ts';
import { Inject } from 'typedi';
import { SettingsService } from '../service/settings.service';

import { Request } from 'express';
import { addMinutes, format } from 'date-fns';
import { Op, WhereOptions } from 'sequelize';
import {
  deleteCompetitionTop,
  deleteExternalBannerSlide,
  deleteFormBannerSlide,
  deleteMainBannerSlide,
  deleteTeaser,
  getAllCategoryBySport,
  getAllCompetitionByCategory,
  getAllEventsByCompetition,
  getAllSport,
  getCompetitionTop,
  getExternalBannerSlide,
  getExternalBannerSlideSizes,
  getExternalBannerSlideTypes,
  getFormBannerSlide,
  getMainBannerSlide,
  getOneExternalBannerSlide,
  getOneFormBannerSlide,
  getTeaser,
  patchCompetitionsTop,
  patchExternalBannerSlide,
  patchMainBannerSlides,
  patchTeasers,
  saveCompetitionTop,
  saveExternalBannerSLide,
  saveFormBannerSLide,
  saveMainBannerSLide,
  saveTeaser,
} from '../../swagger/operations/widget';
import sequelize from '../db';
import {
  CmsImage,
  CompetitionTop,
  ExternalBanner,
  ExternalBannerSlideType,
  MainBannerSlide,
  Teaser,
  UserLog,
} from '../db/models';
import CmsImageItem from '../db/models/CmsImageItem';
import CmsImageItemToEntity from '../db/models/CmsImageItemToEntity';
import ExternalBannerSize from '../db/models/ExternalBannerSize';
import FormBanner from '../db/models/FormBanner';
import {
  DeleteCompetitionTopDto,
  DeleteMainBannerSlideDto,
  DeleteTeaserDto,
  GetAllCategoriesBySportDto,
  GetAllCompetitionsByCategoryDto,
  GetAllEventsByCategoryDto,
  GetCategoriesResponseDto,
  GetCompetitionTopDto,
  GetCompetitionsResponseDto,
  GetExternalBannerSlideResponseDto,
  GetFormBannerSlideResponseDto,
  GetMainBannerSlideDto,
  GetSSSportsResponseDto,
  GetTeaserDto,
  GetTeaserResponseDto,
  PatchActiveAndPositionDto,
  QueryWithId,
  SaveExternalBannerSlideDto,
  SaveFormBannerSlideDto,
  SuccessStatusResponse,
  UpdateCompetitionTopDto,
  UpdateCompetitionTopResponseDto,
  UpdateMainBannerResponseDto,
  UpdateMainBannerSlideDto,
  UpdateTeaserDto,
  UpdateTeaserResponseDto,
} from '../dto';
import { DeleteByIdDto } from '../dto/response/shared';
import { getWidgetAliasFromCompetition, getWidgetAliasFromEvent } from '../helper/breadcrumbs';
import {
  IMAGE_DESTINATION_ENUM,
  MAX_IMAGE_FILE_SIZE,
  MAX_LOGO_FILE_SIZE,
  MAX_TEASER_UPLOAD_FILES,
  SS_EVENT_STATUSES,
  TEASER_EVENT_STATUS_ENUM,
  USER_LOG_ACTIONS,
} from '../helper/constants';
import { DefaultController } from '../helper/custom-controller.decorator';
import { NotFoundError, SaveError, ServerError } from '../helper/errors';
import { deleteItem, removeEntityCmsImageGallery, uploadCmsGalleryItems, uploadCmsImage } from '../helper/image';
import { getIntFromUrnId } from '../helper/parseStrings';
import { patchManyEntities } from '../helper/patch';
import { requestImagesValidation } from '../helper/request-validation.helper';
import { log } from '../helper/sentry';
import {
  Competition,
  Event,
  getCategoriesBySport,
  getCompetitionById,
  getEventById,
  getEventsByCompetition,
  getMatchByTournamentId,
  getMatchByTournamentIdPrematchAndLive,
  getSports,
  getTournamentsByCategory,
} from '../lib/softswiss';
import { WidgetService } from '../service/widget.service';
import { CalendarScheduleService } from '../service/calendar-schedule.service';
import { get, pick } from 'lodash';
import { ScheduleTypeEnum } from '../interface/calendar-schedule.type';
@DefaultController('/widget', 'Widget')
export class WidgetController {
  @Inject()
  private readonly settingsService: SettingsService;

  @Inject()
  private readonly calendarScheduleService: CalendarScheduleService;

  @Inject()
  private readonly widgetService: WidgetService;

  @ApiOperationGet(getCompetitionTop)
  @Post('top-competition')
  async getCompetitionTop(@Body() body: GetCompetitionTopDto) {
    const where: WhereOptions = {};

    if (body.id) {
      return this.widgetService.getCompetitionTopById(body.id);
    }

    if (body.search) {
      where.name = {
        [Op.iLike]: `%${body.search}%`,
      };
    }

    const rows = await this.widgetService.getCompetitionTopRows(where);

    return { rows };
  }

  @ApiOperationPost(saveCompetitionTop)
  @Post('top-competition/save')
  async saveCompetitionTop(
    @Req() req: Request,
    @Body() body: UpdateCompetitionTopDto,
    @UploadedFile('logo', {
      options: {
        limits: { fileSize: MAX_LOGO_FILE_SIZE },
      },
    })
    file?: Express.Multer.File,
  ): Promise<UpdateCompetitionTopResponseDto> {
    requestImagesValidation(file);

    const t = await sequelize.transaction();

    let competitionTopId = body.id;
    try {
      if (!competitionTopId) {
        competitionTopId = await this.widgetService.createCompetitionTop(body, req, t);
      } else {
        await this.widgetService.updateCompetitionTop(body, competitionTopId, req, t);
      }
      await t.commit();
    } catch (err) {
      await t.rollback();
      log(err);
      throw new SaveError(err.message);
    }

    if (file) {
      const competition_top = await CompetitionTop.findByPk(competitionTopId);
      await uploadCmsImage(competition_top, file, IMAGE_DESTINATION_ENUM.TOP_COMPETITION);
    }
    return { id: competitionTopId };
  }

  @ApiOperationPost(patchCompetitionsTop)
  @Post('top-competition/patchMany')
  async patchCompetitionTop(
    @Req() req: Request,
    @Body() body: PatchActiveAndPositionDto,
  ): Promise<SuccessStatusResponse> {
    try {
      await patchManyEntities(CompetitionTop, body.data);
      await UserLog.add(USER_LOG_ACTIONS.COMPETITION_TOP_UPDATE, req);
    } catch (err) {
      log(err);
      throw new SaveError();
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(deleteCompetitionTop)
  @Post('top-competition/delete')
  async deleteCompetitionTop(
    @Req() req: Request,
    @Body() body: DeleteCompetitionTopDto,
  ): Promise<SuccessStatusResponse> {
    const t = await sequelize.transaction();
    try {
      await this.widgetService.deleteCompetitionTop(body.id, req, t);
      await t.commit();
    } catch (err) {
      await t.rollback();
      log(err);
      throw new SaveError();
    }

    return { message: 'OK' };
  }

  @ApiOperationGet(getTeaser)
  @Post('teaser')
  async getTeasers(@Body() body: GetTeaserDto): Promise<GetTeaserResponseDto> {
    const where: WhereOptions = {};

    if (body.search) {
      where.teaser_alias = {
        [Op.iRegexp]: `${body.search.toLowerCase()}`,
      };
    }

    if (body.active !== undefined && body.active !== null) {
      where.active = body.active;
    }

    if (body.has_game !== undefined && body.has_game !== null) {
      where.has_game = body.has_game;
    }

    const teasers = await Teaser.findAll({
      where: where,
      include: [
        {
          model: CmsImageItemToEntity,
          include: [
            {
              model: CmsImageItem,
              include: [{ model: CmsImage, attributes: ['name', 'uuid', 'extension'] }],
            },
          ],
        },
      ],
      order: [
        ['position', 'ASC'],
        ['id', 'DESC'],
        ['cmsImageItems', 'position', 'ASC'],
      ],
    });

    return { rows: teasers };
  }

  @ApiOperationPost(saveTeaser)
  @Post('teaser/save')
  async saveTeaser(
    @Req() req: Request,
    @Body() body: UpdateTeaserDto,
    @UploadedFiles('images', {
      required: false,
      options: {
        limits: {
          files: MAX_TEASER_UPLOAD_FILES,
        },
      },
    })
    files?: Express.Multer.File[],
  ): Promise<UpdateTeaserResponseDto> {
    requestImagesValidation(files);

    if (files?.length) {
      this.widgetService.validateTeaserFilesSize(files);
    }

    const defaultTeaserPosition = 1;
    let teaserId = body.id;
    const start_to = addMinutes(new Date(), body.delay_before_event || 0);

    if (!teaserId) {
      let game: Event;
      let teaserAlias: string;
      let competition: Competition = await getCompetitionById(body.competition_id);

      if (body.event_id) {
        game = await getEventById(body.event_id);
        if (game && body.event_status === TEASER_EVENT_STATUS_ENUM.PREMATCH && game.status === SS_EVENT_STATUSES.LIVE) {
          throw new SaveError('Change event status. Event is already in Live');
        }
      } else {
        if (body.event_status === TEASER_EVENT_STATUS_ENUM.PREMATCH) {
          game = await getMatchByTournamentId(competition.id);
        } else {
          game = await getMatchByTournamentIdPrematchAndLive(competition.id);
        }
      }

      try {
        if (body.event_id && game) {
          teaserAlias = getWidgetAliasFromEvent(game);
        } else {
          competition = await getCompetitionById(body.competition_id);
          if (competition) {
            teaserAlias = getWidgetAliasFromCompetition(competition);
          }
        }
      } catch (err) {
        log(err);
        throw new SaveError('Save Teaser failed');
      }

      const has_game = game && start_to >= new Date(game.start_time) ? 1 : 0;

      const payload: any = {
        teaser_alias: teaserAlias,
        position: body.position ? body.position : defaultTeaserPosition,
        type: body.type,
        delay_before_event: body.delay_before_event,
        event_status: body.event_status,
        active: body.active,
        has_game,
      };
      if (body.event_id && game) {
        payload.ss_competition_id = game.tournament.id;
        payload.competition_id = getIntFromUrnId(game.tournament.urn_id);
        payload.sport_id = getIntFromUrnId(game.tournament.sport.urn_id);
        payload.category_id = getIntFromUrnId(game.tournament.category.urn_id);
        payload.event_id = body.event_id ? getIntFromUrnId(game.urn_id) : null;
      } else if (competition) {
        payload.ss_competition_id = competition.id;
        payload.competition_id = getIntFromUrnId(competition.urn_id);
        payload.sport_id = getIntFromUrnId(competition.sport.urn_id);
        payload.category_id = getIntFromUrnId(competition.category.urn_id);
      }

      const result: Teaser = await Teaser.create(payload, { returning: true });

      teaserId = result.id;
      UserLog.add(USER_LOG_ACTIONS.TEASER_CREATE, req);
    } else {
      const existed = await Teaser.findByPk(teaserId);
      if (!existed) {
        throw new NotFoundError('Teaser not found');
      }

      let game: Event;
      if (existed.event_id) {
        game = await getEventById(existed.event_id);
        if (game && body.event_status === TEASER_EVENT_STATUS_ENUM.PREMATCH && game.status === SS_EVENT_STATUSES.LIVE) {
          throw new SaveError('Change event status. Event is already in Live');
        }
      } else {
        if (body.event_status === TEASER_EVENT_STATUS_ENUM.PREMATCH) {
          game = await getMatchByTournamentId(existed.ss_competition_id);
        } else {
          game = await getMatchByTournamentIdPrematchAndLive(existed.ss_competition_id);
        }
      }
      const has_game = game && start_to >= new Date(game.start_time) ? 1 : 0;

      const updatedRecord: Partial<Teaser> = {
        type: body.type,
        event_status: body.event_status,
        active: body.active,
        delay_before_event: body.delay_before_event,
        position: body.position ? body.position : defaultTeaserPosition,
        has_game,
      };

      await Teaser.update(updatedRecord, { where: { id: teaserId } });
      UserLog.add(USER_LOG_ACTIONS.TEASER_UPDATE, req);
    }

    if (files.length) {
      const teaser = await Teaser.findByPk(teaserId);

      try {
        await removeEntityCmsImageGallery(teaser, IMAGE_DESTINATION_ENUM.TEASER);

        await uploadCmsGalleryItems(teaser.id, files, IMAGE_DESTINATION_ENUM.TEASER);
      } catch (err) {
        log(err);
        throw new ServerError('Save teaser failed');
      }
    }

    return { id: teaserId };
  }

  @ApiOperationPost(patchTeasers)
  @Post('teaser/patchMany')
  async patchTeaser(@Req() req: Request, @Body() body: PatchActiveAndPositionDto): Promise<SuccessStatusResponse> {
    try {
      await patchManyEntities(Teaser, body.data);
      await UserLog.add(USER_LOG_ACTIONS.TEASER_UPDATE, req);
    } catch (err) {
      log(err);
      throw new SaveError();
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(deleteTeaser)
  @Post('teaser/delete')
  async deleteTeaser(@Req() req: Request, @Body() body: DeleteTeaserDto): Promise<[]> {
    try {
      const teaser = await Teaser.findByPk(body.id);
      if (!teaser) {
        throw new NotFoundError('Teaser is not found');
      }
      await removeEntityCmsImageGallery(teaser, IMAGE_DESTINATION_ENUM.TEASER);
      await teaser.destroy();
      await UserLog.add(USER_LOG_ACTIONS.TEASER_DELETE, req);
    } catch (err) {
      log(err);
      throw new ServerError('delete Teaser failed');
    }

    return [];
  }

  @ApiOperationGet(getMainBannerSlide)
  @Post('main-banner-slide')
  async getMainBannerSlides(@Body() body: GetMainBannerSlideDto) {
    const where: WhereOptions = {};

    if (body.search) {
      where.title = {
        [Op.iLike]: `%${body.search}%`,
      };
    }
    const res = await this.widgetService.getMainBannerSlides(where);

    return { rows: res };
  }

  @ApiOperationPost(saveMainBannerSLide)
  @Post('main-banner-slide/save')
  async saveMainBannerSlide(
    @Req() req: Request,
    @Body() body: UpdateMainBannerSlideDto,
    @UploadedFile('image', {
      options: {
        limits: { fileSize: MAX_IMAGE_FILE_SIZE },
      },
    })
    file?: Express.Multer.File,
  ): Promise<UpdateMainBannerResponseDto> {
    requestImagesValidation(file);

    const defaultPosition = 1;
    let slideId = body.id;

    const t = await sequelize.transaction();
    try {
      this.widgetService.validateMainBanner(body);
      this.widgetService.validateMainBannerTextValues(body.text_values, body.type);

      const payload = {
        schedule_start_date: get(body, 'schedule_start_date', format(new Date(), 'yyyy-MM-dd')),
        schedule_start_time: get(body, 'schedule_start_time', format(new Date(), 'HH:mm')),
        position: get(body, 'position', defaultPosition),
        schedule_days: body.schedule_type === ScheduleTypeEnum.DAY ? [1] : body.schedule_days,
        ...pick(
          body,
          'type',
          'title_color',
          'small_text_color',
          'external',
          'schedule',
          'active',
          'background_color',
          'schedule_finish_date',
          'schedule_finish_time',
          'display_for_logged_in',
          'display_for_not_logged_in',
          'schedule_days',
          'schedule_type',
          'time_zone',
        ),
      };

      if (!slideId) {
        slideId = await this.widgetService.createMainBannerSlide(payload, body.text_values, req, t);
      } else {
        await this.widgetService.updateMainBannerSlide(slideId, payload, body.text_values, req, t);
      }

      const entityPayload = { entity_id: slideId, entity_type: 'bb_cms_banner_main_slide' };

      await this.calendarScheduleService.removeAllScheduleIntervals(entityPayload, t);

      const calendarPayload = pick(
        payload,
        'schedule_start_date',
        'schedule_finish_date',
        'schedule_start_time',
        'schedule_finish_time',
        'schedule_type',
        'schedule_days',
        'time_zone',
      );

      await this.calendarScheduleService.createScheduleIntervals(calendarPayload, entityPayload, t);
      await this.widgetService.updateMainBannerSlideGroups(slideId, body.group_ids, t);
      await t.commit();
    } catch (err) {
      await t.rollback();
      log(err);
      throw new SaveError(err.message);
    }

    if (file) {
      const slide = await MainBannerSlide.findByPk(slideId);
      await uploadCmsImage(slide, file, IMAGE_DESTINATION_ENUM.MAIN_BANNER_SLIDE);
    }
    return { id: slideId };
  }

  @ApiOperationPost(patchMainBannerSlides)
  @Post('main-banner-slide/patchMany')
  async patchMainBannerSlide(
    @Req() req: Request,
    @Body() body: PatchActiveAndPositionDto,
  ): Promise<SuccessStatusResponse> {
    try {
      await patchManyEntities(MainBannerSlide, body.data);
      await UserLog.add(USER_LOG_ACTIONS.MAIN_BANNER_SLIDE_UPDATE, req);
    } catch (err) {
      log(err);
      throw new SaveError();
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(deleteMainBannerSlide)
  @Post('main-banner-slide/delete')
  async deleteMainBannerSlide(
    @Req() req: Request,
    @Body() body: DeleteMainBannerSlideDto,
  ): Promise<SuccessStatusResponse> {
    const record = await MainBannerSlide.findByPk(body.id);
    if (!record) {
      throw new NotFoundError('Main banner slide is not found');
    }

    const t = await sequelize.transaction();
    try {
      await record.destroy({ transaction: t });
      if (record.cms_image_item_id !== null) {
        await deleteItem(record.cms_image_item_id, IMAGE_DESTINATION_ENUM.MAIN_BANNER_SLIDE);
      }
      await UserLog.add(USER_LOG_ACTIONS.MAIN_BANNER_SLIDE_DELETE, req, t);
      await t.commit();
    } catch (err) {
      await t.rollback();
      log(err);
      throw new SaveError();
    }

    return { message: 'OK' };
  }

  @ApiOperationGet(getAllSport)
  @Get('get-all-event')
  async getAllSport(): Promise<GetSSSportsResponseDto> {
    const sports = await getSports();
    return {
      rows: sports,
    };
  }

  @ApiOperationPost(getAllCategoryBySport)
  @Post('get-all-category-by-event')
  async getAllCategoryBySport(@Body() body: GetAllCategoriesBySportDto): Promise<GetCategoriesResponseDto> {
    const categories = await getCategoriesBySport(body.sport_id);
    return {
      rows: categories,
    };
  }

  @ApiOperationPost(getAllCompetitionByCategory)
  @Post('get-all-competition-by-category')
  async getAllCompetitionByCategory(
    @Body() body: GetAllCompetitionsByCategoryDto,
  ): Promise<GetCompetitionsResponseDto> {
    const competitions = await getTournamentsByCategory(body.category_id);
    return {
      rows: competitions,
    };
  }

  @ApiOperationPost(getAllEventsByCompetition)
  @Post('get-all-events-by-competition')
  async getEventsByCompetition(@Body() body: GetAllEventsByCategoryDto): Promise<GetCompetitionsResponseDto> {
    const tournaments = await getEventsByCompetition(body.competition_id);
    return {
      rows: tournaments,
    };
  }

  @ApiOperationPost(saveFormBannerSLide)
  @Post('form-banner-slide/save')
  async saveFormBannerSlide(
    @Req() req: Request,
    @Body() body: SaveFormBannerSlideDto,
    @UploadedFile('image', {
      options: {
        limits: { fileSize: MAX_IMAGE_FILE_SIZE },
      },
    })
    file?: Express.Multer.File,
  ): Promise<UpdateCompetitionTopResponseDto> {
    requestImagesValidation(file);

    const t = await sequelize.transaction();

    let recordId = body.id;
    try {
      if (!recordId) {
        recordId = await this.widgetService.createFormBannerSlide(body, t);
        await UserLog.add(USER_LOG_ACTIONS.FORM_BANNER_SLIDE_CREATE, req, t);
      } else {
        await this.widgetService.updateFormBannerSlide(recordId, body, t);
        await UserLog.add(USER_LOG_ACTIONS.FORM_BANNER_SLIDE_UPDATE, req, t);
      }
      await t.commit();
    } catch (err) {
      await t.rollback();
      log(err);
      throw new SaveError(err.message);
    }

    if (file) {
      const record = await FormBanner.findByPk(recordId);
      await uploadCmsImage(record, file, IMAGE_DESTINATION_ENUM.FORM_BANNER_SLIDE);
    }
    return { id: recordId };
  }

  @ApiOperationPost(getFormBannerSlide)
  @Post('form-banner-slide')
  async getFormBannerSlide(@Body() body: GetMainBannerSlideDto): Promise<GetFormBannerSlideResponseDto> {
    const result = await this.widgetService.getFormBannerSlide(body);

    return result;
  }

  @ApiOperationPost(getOneFormBannerSlide)
  @Post('form-banner-slide/get')
  async getOneFormBannerSlide(@Body() body: QueryWithId): Promise<FormBanner> {
    const { id } = body;
    const result = await this.widgetService.getOneFormBannerSlide(id);

    return result;
  }

  @ApiOperationPost(deleteFormBannerSlide)
  @Post('form-banner-slide/delete')
  async deleteFormBannerSlide(@Req() req: Request, @Body() body: DeleteByIdDto): Promise<SuccessStatusResponse> {
    const t = await sequelize.transaction();
    try {
      await this.widgetService.deleteFormBannerSlide(body.id, t);
      await UserLog.add(USER_LOG_ACTIONS.FORM_BANNER_SLIDE_DELETE, req, t);
      await t.commit();
    } catch (err) {
      await t.rollback();
      log(err);
      throw new ServerError();
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(saveExternalBannerSLide)
  @Post('external-banner-slide/save')
  async saveExternalBannerSlide(
    @Req() req: Request,
    @Body() body: SaveExternalBannerSlideDto,
  ): Promise<UpdateCompetitionTopResponseDto> {
    const t = await sequelize.transaction();

    let recordId = body.id;
    try {
      if (!recordId) {
        recordId = await this.widgetService.createExternalBannerSlide(body, t);
        await UserLog.add(USER_LOG_ACTIONS.EXTERNAL_BANNER_SLIDE_CREATE, req, t);
      } else {
        await this.widgetService.updateExternalBannerSlide(recordId, body, t);
        await UserLog.add(USER_LOG_ACTIONS.EXTERNAL_BANNER_SLIDE_UPDATE, req, t);
      }
      await t.commit();
    } catch (err) {
      await t.rollback();
      log(err);
      throw new SaveError(err.message);
    }

    return { id: recordId };
  }

  @ApiOperationPost(getExternalBannerSlide)
  @Post('external-banner-slide')
  async getExternalBannerSlide(@Body() body: GetMainBannerSlideDto): Promise<GetExternalBannerSlideResponseDto> {
    const result = await this.widgetService.getExternalBannerSlide(body);

    return result;
  }

  @ApiOperationPost(getOneExternalBannerSlide)
  @Post('external-banner-slide/get')
  async getOneExternalBannerSlide(@Body() body: QueryWithId): Promise<ExternalBanner> {
    const { id } = body;
    const result = await this.widgetService.getOneExternalBannerSlide(id);

    return result;
  }

  @ApiOperationPost(deleteExternalBannerSlide)
  @Post('external-banner-slide/delete')
  async deleteExternalBannerSlide(@Req() req: Request, @Body() body: DeleteByIdDto): Promise<SuccessStatusResponse> {
    const t = await sequelize.transaction();
    try {
      await this.widgetService.deleteExternalBannerSlide(body.id, t);
      await UserLog.add(USER_LOG_ACTIONS.EXTERNAL_BANNER_SLIDE_DELETE, req, t);
      await t.commit();
    } catch (err) {
      await t.rollback();
      log(err);
      throw new ServerError();
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(patchExternalBannerSlide)
  @Post('external-banner-slide/patchMany')
  async patchExternalBannerSlide(
    @Req() req: Request,
    @Body() body: PatchActiveAndPositionDto,
  ): Promise<SuccessStatusResponse> {
    try {
      await patchManyEntities(ExternalBanner, body.data);
      await UserLog.add(USER_LOG_ACTIONS.EXTERNAL_BANNER_SLIDE_UPDATE, req);
    } catch (err) {
      log(err);
      throw new SaveError();
    }

    return { message: 'OK' };
  }

  @ApiOperationGet(getExternalBannerSlideTypes)
  @Get('external-banner-slide/types')
  async getExternalBannerSlideTypes(): Promise<ExternalBannerSlideType[]> {
    const result = await this.widgetService.getExternalBannerSlideTypes();

    return result;
  }

  @ApiOperationGet(getExternalBannerSlideSizes)
  @Get('external-banner-slide/sizes')
  async getExternalBannerSlideSize(): Promise<ExternalBannerSize[]> {
    const result = await this.widgetService.getExternalBannerSlideSizes();

    return result;
  }
}
