import { Request } from 'express';
import { map } from 'lodash';
import { Op, Sequelize, Transaction, WhereOptions } from 'sequelize';
import { Inject, Service } from 'typedi';
import {
  CmsBannerMainSlideGroup,
  CmsImage,
  CompetitionTop,
  CompetitionTopTextValue,
  Country,
  ExternalBanner,
  ExternalBannerEvent,
  ExternalBannerSizeToSlide,
  ExternalBannerSlideType,
  ExternalBannerToCountry,
  MainBannerSlide,
  MainBannerSlideTextValue,
  PlatformGroup,
  SiteDomain,
  TranslateLanguage,
  UserLog,
} from '../db/models';
import CmsImageItem from '../db/models/CmsImageItem';
import ExternalBannerSize from '../db/models/ExternalBannerSize';
import FormBanner from '../db/models/FormBanner';
import FormBannerTextValue from '../db/models/FormBannerTextValue';
import {
  BOOLEAN_SMALLINT,
  GetExternalBannerSlideResponseDto,
  GetFormBannerSlideResponseDto,
  GetMainBannerSlideDto,
  SaveExternalBannerSlideDto,
  SaveExternalBannerSlideEventDto,
  SaveFormBannerSlideDto,
  SaveFormBannerSlideTextValueDto,
  UpdateCompetitionTopDto,
  UpdateMainBannerSlideDto,
  UpdateMainBannerSlideTextValueDto,
} from '../dto';
import { getWidgetAliasFromCompetition, getWidgetAliasFromEvent } from '../helper/breadcrumbs';
import {
  IMAGE_DESTINATION_ENUM,
  MAIN_BANNER_SLIDE_TYPE_ENUM,
  MAX_IMAGE_FILE_SIZE,
  USER_LOG_ACTIONS,
} from '../helper/constants';
import { BadRequestError, NotFoundError, SaveError, ServerError } from '../helper/errors';
import { deleteItem } from '../helper/image';
import { getIntFromUrnId } from '../helper/parseStrings';
import { log } from '../helper/sentry';
import { stripSecondsFromTimeString } from '../helper/time';
import {
  getCategoryById,
  getCompetitionById,
  getEventById,
  getMatchByTournamentId,
  getSportById,
} from '../lib/softswiss';
import { SettingsService } from './settings.service';

@Service()
export class WidgetService {
  @Inject()
  private readonly settingsService: SettingsService;

  async updateMainBannerSlideGroups(slideId: number, groupIds: number[], transaction: Transaction) {
    await CmsBannerMainSlideGroup.destroy({ where: { banner_id: slideId }, transaction });

    const bannerGroups = map(groupIds, (groupId) => ({ banner_id: slideId, group_id: groupId }));

    await CmsBannerMainSlideGroup.bulkCreate(bannerGroups, { transaction });
  }

  async createMainBannerSlide(slidePayload, textPayload, req, transaction?: Transaction): Promise<number> {
    const result: MainBannerSlide = await MainBannerSlide.create(slidePayload, { returning: true, transaction });
    await Promise.all(
      textPayload.map((text) =>
        MainBannerSlideTextValue.create(
          {
            ...text,
            slide_id: result.id,
          },
          { transaction },
        ),
      ),
    );
    await UserLog.add(USER_LOG_ACTIONS.MAIN_BANNER_SLIDE_CREATE, req, transaction);

    return result.id;
  }

  async updateMainBannerSlide(slideId, slidePayload, textPayload, req, transaction?: Transaction): Promise<void> {
    await MainBannerSlide.update(slidePayload, { where: { id: slideId }, transaction });
    await MainBannerSlideTextValue.destroy({ where: { slide_id: slideId }, transaction });
    await Promise.all(
      textPayload.map((text) =>
        MainBannerSlideTextValue.create(
          {
            ...text,
            slide_id: slideId,
          },
          { transaction },
        ),
      ),
    );
    await UserLog.add(USER_LOG_ACTIONS.MAIN_BANNER_SLIDE_UPDATE, req, transaction);
  }

  async getMainBannerSlides(where: WhereOptions) {
    const slides: MainBannerSlide[] = await MainBannerSlide.findAll({
      include: [
        {
          model: PlatformGroup,
          attributes: ['id', 'name'],
        },
        {
          model: CmsImageItem,
          attributes: ['uuid', 'extension'],
          include: [{ model: CmsImage, attributes: ['name'] }],
        },
        {
          model: MainBannerSlideTextValue,
          where,
          include: [{ model: SiteDomain }, { model: TranslateLanguage }],
        },
      ],
      order: [
        ['position', 'ASC'],
        ['id', 'DESC'],
      ],
    });

    return await Promise.all(
      slides.map(async (record) => {
        record.schedule_finish_time = record.schedule_finish_time
          ? stripSecondsFromTimeString(record.schedule_finish_time)
          : null;
        record.schedule_start_time = record.schedule_start_time
          ? stripSecondsFromTimeString(record.schedule_start_time)
          : null;

        const textValue = await this.settingsService.getDefaultValue<MainBannerSlideTextValue>(
          {
            slide_id: record.id,
          },
          MainBannerSlideTextValue,
        );

        record.title = textValue?.title;

        return record.toJSON();
      }),
    );
  }

  async deleteMainBannerSlide(slideId, req, transaction?: Transaction) {
    const record = await MainBannerSlide.findByPk(slideId);
    if (!record) {
      throw new NotFoundError('Main banner slide is not found');
    }

    await record.destroy({ transaction });
    if (record.cms_image_item_id !== null) {
      await deleteItem(record.cms_image_item_id, IMAGE_DESTINATION_ENUM.MAIN_BANNER_SLIDE);
    }
    await MainBannerSlideTextValue.destroy({ where: { slide_id: slideId }, transaction });
    await UserLog.add(USER_LOG_ACTIONS.MAIN_BANNER_SLIDE_DELETE, req, transaction);
  }

  async createCompetitionTop(
    data: UpdateCompetitionTopDto,
    req: Request,
    transaction: Transaction = null,
  ): Promise<number> {
    const existedSlug = await CompetitionTop.findOne({ where: { slug: data.slug } });

    if (existedSlug) {
      throw new BadRequestError(`Slug ${data.slug} is already existed`);
    }
    if (!data.competition_id) {
      throw new BadRequestError();
    }
    const competitionSS = await getCompetitionById(data.competition_id);
    const game = await getMatchByTournamentId(data.competition_id);

    const result = await CompetitionTop.create(
      {
        ss_competition_id: competitionSS.id,
        competition_id: getIntFromUrnId(competitionSS.urn_id),
        sport_id: getIntFromUrnId(competitionSS.sport.urn_id),
        category_id: getIntFromUrnId(competitionSS.category.urn_id),
        slug: data.slug,
        position: data.position ? data.position : 100,
        color: data.color,
        active: data.active,
        has_game: game ? 1 : 0,
        category_alias: data.category_alias,
      },
      { returning: true, transaction },
    );

    await Promise.all(
      data.text_values.map((value) =>
        CompetitionTopTextValue.create(
          {
            top_competition_id: result.id,
            name: value.name,
            language_id: value.language_id,
            site_domain_id: value.site_domain_id,
          },
          { transaction },
        ),
      ),
    );

    await UserLog.add(USER_LOG_ACTIONS.COMPETITION_TOP_CREATE, req, transaction);

    return result.id;
  }

  async updateCompetitionTop(
    data: UpdateCompetitionTopDto,
    competitionTopId: number,
    req: Request,
    transaction: Transaction = null,
  ) {
    const existedSlug = await CompetitionTop.findOne({ where: { slug: data.slug } });
    const existedPageCompetitionTop = await CompetitionTop.findByPk(competitionTopId);
    if (!existedPageCompetitionTop) {
      throw new NotFoundError(`CompetitionTop ${competitionTopId} is not found`);
    }
    if (existedSlug && existedPageCompetitionTop.slug !== data.slug) {
      throw new BadRequestError(`Slug ${data.slug} is already existed`);
    }
    const toUpdate: Partial<CompetitionTop> = {
      slug: data.slug,
      color: data.color,
      position: data.position ? data.position : 100,
      active: data.active,
    };
    await CompetitionTop.update(toUpdate, { where: { id: competitionTopId }, transaction });
    await CompetitionTopTextValue.destroy({ where: { top_competition_id: competitionTopId }, transaction });
    await Promise.all(
      data.text_values.map((value) =>
        CompetitionTopTextValue.create(
          {
            top_competition_id: competitionTopId,
            name: value.name,
            language_id: value.language_id,
            site_domain_id: value.site_domain_id,
          },
          { transaction },
        ),
      ),
    );

    await UserLog.add(USER_LOG_ACTIONS.COMPETITION_TOP_UPDATE, req, transaction);
  }

  async getCompetitionTopById(id: number): Promise<CompetitionTop> {
    const record = CompetitionTop.findByPk(id, {
      include: [
        {
          model: CmsImageItem,
          attributes: ['uuid', 'extension'],
          include: [{ model: CmsImage, attributes: ['name'] }],
        },
        {
          model: CompetitionTopTextValue,
        },
      ],
    });

    if (!record) {
      throw new NotFoundError(`CompetitionTop ${id} is not found`);
    }

    return record;
  }

  async getCompetitionTopRows(where: WhereOptions): Promise<(CompetitionTop & { name: string })[]> {
    const rows = await CompetitionTop.findAll({
      include: [
        {
          model: CmsImageItem,
          attributes: ['uuid', 'extension'],
          include: [{ model: CmsImage, attributes: ['name'] }],
        },
        {
          where,
          model: CompetitionTopTextValue,
          include: [{ model: SiteDomain }, { model: TranslateLanguage }],
        },
      ],
      order: [
        ['position', 'ASC'],
        ['id', 'ASC'],
      ],
    });

    return Promise.all(
      rows.map(async (topCompetition) => {
        const textValue = await this.settingsService.getDefaultValue<CompetitionTopTextValue>(
          {
            top_competition_id: topCompetition.id,
          },
          CompetitionTopTextValue,
        );

        topCompetition.name = textValue?.name;

        return topCompetition.toJSON();
      }),
    );
  }

  async deleteCompetitionTop(recordId, req, transaction?: Transaction) {
    const record = await CompetitionTop.findByPk(recordId);
    if (!record) {
      throw new NotFoundError('Competition top is not found');
    }

    await record.destroy({ transaction });
    if (record.cms_image_item_id !== null) {
      await deleteItem(record.cms_image_item_id, IMAGE_DESTINATION_ENUM.TOP_COMPETITION);
    }
    await CompetitionTopTextValue.destroy({ where: { top_competition_id: recordId }, transaction });
    await UserLog.add(USER_LOG_ACTIONS.COMPETITION_TOP_DELETE, req, transaction);
  }

  async createFormBannerSlide(data: SaveFormBannerSlideDto, transaction: Transaction | null = null): Promise<number> {
    if (data.active) {
      await this.disablePreviousActiveFormBannerSLide(data.type, transaction);
    }

    const created = await FormBanner.create(
      {
        type: data.type,
        active: data.active,
        title_color: data.title_color,
      },
      { returning: true, transaction },
    );

    await this.createFormBannerTextValues(data.text_values, created.id, transaction);

    return created.id;
  }

  async disablePreviousActiveFormBannerSLide(type: string, transaction: Transaction | null = null) {
    return FormBanner.update(
      {
        active: BOOLEAN_SMALLINT.FALSE,
      },
      {
        where: {
          type,
        },
        transaction,
      },
    );
  }

  async updateFormBannerSlide(
    slideId: number,
    data: SaveFormBannerSlideDto,
    transaction: Transaction | null = null,
  ): Promise<void> {
    const existedCount = await FormBanner.count({ where: { id: slideId } });
    if (existedCount === 0) {
      throw new BadRequestError(`Form banner slide ${slideId} not existed`);
    }

    if (data.active) {
      await this.disablePreviousActiveFormBannerSLide(data.type, transaction);
    }

    await FormBanner.update(
      {
        type: data.type,
        active: data.active,
        title_color: data.title_color,
      },
      {
        where: { id: slideId },
        transaction,
      },
    );

    await FormBannerTextValue.destroy({ where: { form_banner_slide_id: slideId }, transaction });
    await this.createFormBannerTextValues(data.text_values, slideId, transaction);
  }

  private async createFormBannerTextValues(
    values: SaveFormBannerSlideTextValueDto[],
    bannerId: number,
    transaction: Transaction | null = null,
  ) {
    const promises = [];

    for (const value of values) {
      promises.push(
        FormBannerTextValue.create(
          {
            form_banner_slide_id: bannerId,
            language_id: value.language_id,
            site_domain_id: value.site_domain_id,
            text: value.text,
            cards: value.cards,
          },
          { transaction },
        ),
      );
    }

    await Promise.all(promises);
  }

  async getOneFormBannerSlide(id: number) {
    let record;
    try {
      record = await FormBanner.findByPk(id, {
        include: [
          {
            model: CmsImageItem,
            attributes: ['uuid', 'extension'],
            include: [{ model: CmsImage, attributes: ['name'] }],
          },
          {
            model: FormBannerTextValue,
            attributes: { exclude: ['id'] },
            include: [{ model: SiteDomain }, { model: TranslateLanguage }],
          },
        ],
      });
    } catch (err) {
      log(err);
      throw new ServerError();
    }

    if (!record) {
      throw new NotFoundError('FormBannerSLide is not found');
    }
    this.getFormBannerSlideDefaultTextValuesForGetQuery([record]);
    return record;
  }

  async getFormBannerSlide(body: GetMainBannerSlideDto): Promise<GetFormBannerSlideResponseDto> {
    const where: WhereOptions = {};

    if (body.search) {
      where.text = {
        [Op.iLike]: `%${body.search}%`,
      };
    }

    const { count, rows } = await FormBanner.findAndCountAll<FormBanner>({
      include: [
        {
          model: CmsImageItem,
          attributes: ['uuid', 'extension'],
          include: [{ model: CmsImage, attributes: ['name'] }],
        },
        {
          model: FormBannerTextValue,
          attributes: { exclude: ['id'] },
          where,
          include: [{ model: SiteDomain }, { model: TranslateLanguage }],
        },
      ],
      distinct: true,
      order: [
        ['active', 'DESC'],
        ['id', 'DESC'],
        Sequelize.literal(
          `CASE WHEN "FormBanner"."type" = 'register' THEN 1 WHEN "FormBanner"."type" = 'login' THEN 2 WHEN "FormBanner"."type" = 'recover_password' THEN 3 END`,
        ),
      ],
      limit: body.per_page,
      offset: (body.page - 1) * body.per_page,
    });

    if (!rows.length) {
      return {
        rows: [],
        pages: 1,
        current_page: 1,
      };
    }

    return {
      rows: this.getFormBannerSlideDefaultTextValuesForGetQuery(rows),
      pages: Math.ceil(count / body.per_page),
      current_page: body.page,
    };
  }

  async deleteFormBannerSlide(bannerId: number, transaction?: Transaction): Promise<void> {
    const record = await FormBanner.findByPk(bannerId);
    if (!record) {
      throw new NotFoundError('Form banner slide is not found');
    }

    await record.destroy({ transaction });
    await FormBannerTextValue.destroy({ where: { id: bannerId }, transaction });

    if (record.cms_image_item_id !== null) {
      await deleteItem(record.cms_image_item_id, IMAGE_DESTINATION_ENUM.FORM_BANNER_SLIDE);
    }
  }

  async createExternalBannerSlide(
    data: SaveExternalBannerSlideDto,
    transaction: Transaction | null = null,
  ): Promise<number> {
    const created = await ExternalBanner.create(
      {
        name: data.name,
        type: data.type,
        active: data.active,
        delay_before_event: data.delay_before_event,
        time_zone: data.time_zone,
      },
      { returning: true, transaction },
    );

    await this.createExternalBannerAssets(created.id, data, transaction);

    return created.id;
  }

  async updateExternalBannerSlide(
    bannerId: number,
    data: SaveExternalBannerSlideDto,
    transaction: Transaction | null = null,
  ): Promise<void> {
    const existed = await ExternalBanner.findByPk(bannerId);
    if (!existed) {
      throw new NotFoundError('External banner is not found');
    }

    await ExternalBanner.update(
      {
        name: data.name,
        type: data.type,
        active: data.active,
        delay_before_event: data.delay_before_event,
        time_zone: data.time_zone,
        processed_at: null,
      },
      { where: { id: bannerId }, transaction },
    );

    await ExternalBannerSizeToSlide.destroy({ where: { external_banner_id: bannerId }, transaction });
    await ExternalBannerToCountry.destroy({ where: { external_banner_id: bannerId }, transaction });

    await this.createExternalBannerSizes(bannerId, data.sizes, transaction);
    await this.createExternalBannerCountries(bannerId, data.countries, transaction);
    await this.processExternalBannerEventsOnUpdate(bannerId, data.events, transaction);
  }

  private async processExternalBannerEventsOnUpdate(
    bannerId: number,
    eventsDto: SaveExternalBannerSlideEventDto[],
    transaction?: Transaction,
  ) {
    const existedEvents = await ExternalBannerEvent.findAll({ where: { external_banner_id: bannerId }, transaction });

    const eventsForDrop = existedEvents.filter((existed) => !eventsDto.find((eventDto) => existed.id === eventDto.id));
    if (eventsForDrop.length) {
      await ExternalBannerEvent.destroy({
        where: {
          id: {
            [Op.in]: eventsForDrop.map((e) => e.id),
          },
        },
        transaction,
      });
    }

    const eventsForCreate = eventsDto.filter((eventDto) => !eventDto.id);
    if (eventsForCreate.length) {
      await this.createExternalBannerEvents(bannerId, eventsForCreate, transaction);
    }
  }

  async getExternalBannerSlide(body: GetMainBannerSlideDto): Promise<GetExternalBannerSlideResponseDto> {
    const where: WhereOptions = {};

    if (body.search) {
      where.name = { [Op.iLike]: `%${body.search}%` };
    }

    const { count, rows } = await ExternalBanner.findAndCountAll<ExternalBanner>({
      where,
      include: [
        {
          model: ExternalBannerSizeToSlide,
          include: [{ model: ExternalBannerSize, attributes: ['name', 'label', 'type'] }],
          attributes: ['size_id'],
        },
        {
          model: ExternalBannerEvent,
          attributes: { exclude: ['external_banner_id'] },
        },
        {
          model: ExternalBannerToCountry,
          attributes: { exclude: ['id', 'external_banner_id'] },
          include: [
            {
              model: Country,
              attributes: { exclude: ['id'] },
            },
          ],
        },
      ],
      distinct: true,
      order: [['id', 'DESC']],
      limit: body.per_page,
      offset: (body.page - 1) * body.per_page,
    });

    if (!rows.length) {
      return {
        rows: [],
        pages: 1,
        current_page: 1,
      };
    }

    return {
      rows,
      pages: Math.ceil(count / body.per_page),
      current_page: body.page,
    };
  }

  async getOneExternalBannerSlide(bannerId: number) {
    const record = await ExternalBanner.findByPk(bannerId, {
      include: [
        {
          model: ExternalBannerSizeToSlide,
          include: [{ model: ExternalBannerSize, attributes: ['name', 'label', 'type'] }],
          attributes: ['size_id'],
        },
        {
          model: ExternalBannerEvent,
          attributes: { exclude: ['external_banner_id'] },
        },
        {
          model: ExternalBannerToCountry,
          attributes: { exclude: ['id', 'external_banner_id'] },
          include: [
            {
              model: Country,
              attributes: { exclude: ['id'] },
            },
          ],
        },
      ],
    });

    if (!record) {
      throw new NotFoundError('ExternalBannerSlide is not found');
    }

    return record;
  }

  async deleteExternalBannerSlide(bannerId: number, transaction?: Transaction): Promise<void> {
    const record = await ExternalBanner.findByPk(bannerId);
    if (!record) {
      throw new NotFoundError('Form banner slide is not found');
    }

    await record.destroy({ transaction });
    await FormBannerTextValue.destroy({ where: { id: bannerId }, transaction });
  }

  async getExternalBannerSlideTypes(): Promise<ExternalBannerSlideType[]> {
    const data = ExternalBannerSlideType.findAll();
    return data;
  }

  async getExternalBannerSlideSizes(): Promise<ExternalBannerSize[]> {
    const data = ExternalBannerSize.findAll();
    return data;
  }

  private async createExternalBannerAssets(
    bannerId: number,
    data: SaveExternalBannerSlideDto,
    transaction?: Transaction,
  ) {
    await this.createExternalBannerSizes(bannerId, data.sizes, transaction);
    await this.createExternalBannerCountries(bannerId, data.countries, transaction);
    await this.createExternalBannerEvents(bannerId, data.events, transaction);
  }

  private async createExternalBannerSizes(bannerId: number, sizes: Array<number>, transaction: Transaction) {
    await Promise.all(
      sizes.map((size) =>
        ExternalBannerSizeToSlide.create(
          {
            size_id: size,
            external_banner_id: bannerId,
          },
          { transaction },
        ),
      ),
    );
  }

  private async createExternalBannerCountries(bannerId: number, countries: Array<number>, transaction: Transaction) {
    await Promise.all(
      countries.map((country_id) => {
        ExternalBannerToCountry.create(
          {
            country_id,
            external_banner_id: bannerId,
          },
          { transaction },
        );
      }),
    );
  }

  private async createExternalBannerEvents(
    bannerId: number,
    events: SaveExternalBannerSlideEventDto[],
    transaction?: Transaction,
  ) {
    for (const event of events) {
      const payload: any = {
        external_banner_id: bannerId,
      };

      if (!event.sport_id) {
        throw new SaveError('sport_id is required');
      }

      const sport = await getSportById(event.sport_id);

      if (!sport) {
        throw new SaveError('sport is not found');
      }

      const category = event.category_id ? await getCategoryById(event.category_id) : null;
      const competition = event.competition_id ? await getCompetitionById(event.competition_id) : null;
      const competitionEvent = event.event_id ? await getEventById(event.event_id) : null;

      payload.sport_id = sport ? getIntFromUrnId(sport.urn_id) : null;
      payload.ss_sport_id = sport ? sport.id : null;
      payload.category_id = category ? getIntFromUrnId(category.urn_id) : null;
      payload.ss_category_id = category ? category.id : null;
      payload.competition_id = competition ? getIntFromUrnId(competition.urn_id) : null;
      payload.ss_competition_id = competition ? competition.id : null;
      payload.event_id = competitionEvent ? getIntFromUrnId(competitionEvent.urn_id) : null;

      switch (true) {
        case !!competition && !!competitionEvent:
          payload.alias = getWidgetAliasFromEvent(competitionEvent);
          break;
        case !!competition && !competitionEvent:
          payload.alias = getWidgetAliasFromCompetition(competition);
          break;
        case !!category:
          payload.alias = `${sport.name} / ${category.name}`;
          break;
        case sport && !category:
          payload.alias = `${sport.name}`;
          break;
        default:
          payload.alias = null;
          break;
      }

      await ExternalBannerEvent.create(payload, { transaction });
    }
  }

  validateMainBanner(record: UpdateMainBannerSlideDto) {
    if (
      (record.type === MAIN_BANNER_SLIDE_TYPE_ENUM.FULL_IMAGE_NO_BUTTON ||
        record.type === MAIN_BANNER_SLIDE_TYPE_ENUM.FULL_IMAGE_WITH_BUTTON) &&
      record.background_color
    ) {
      throw new SaveError(
        `background_color should be empty for type ${MAIN_BANNER_SLIDE_TYPE_ENUM.FULL_IMAGE_WITH_BUTTON} and ${MAIN_BANNER_SLIDE_TYPE_ENUM.FULL_IMAGE_NO_BUTTON}`,
      );
    }

    if (
      (record.type === MAIN_BANNER_SLIDE_TYPE_ENUM.HALF_IMAGE_WITH_BUTTON ||
        record.type === MAIN_BANNER_SLIDE_TYPE_ENUM.HALF_IMAGE_NO_BUTTON) &&
      !record.background_color
    ) {
      throw new SaveError(
        `background_color should not be empty for type ${MAIN_BANNER_SLIDE_TYPE_ENUM.HALF_IMAGE_WITH_BUTTON} and ${MAIN_BANNER_SLIDE_TYPE_ENUM.HALF_IMAGE_NO_BUTTON}`,
      );
    }

    if (
      (record.type === MAIN_BANNER_SLIDE_TYPE_ENUM.HALF_IMAGE_WITH_BUTTON ||
        record.type === MAIN_BANNER_SLIDE_TYPE_ENUM.FULL_IMAGE_WITH_BUTTON) &&
      !record.external
    ) {
      throw new SaveError(
        `external should not be empty for type ${MAIN_BANNER_SLIDE_TYPE_ENUM.HALF_IMAGE_WITH_BUTTON} and ${MAIN_BANNER_SLIDE_TYPE_ENUM.FULL_IMAGE_WITH_BUTTON}`,
      );
    }
  }

  public validateMainBannerTextValues(values: UpdateMainBannerSlideTextValueDto[], slideType: string): void {
    const TITLE_HALF_IMAGE_TYPE_MAX_LENGTH = 25;
    const TITLE_FULL_IMAGE_TYPE_MAX_LENGTH = 31;
    const BUTTON_NAME_MAX_LENGTH = 12;

    for (const value of values) {
      if (
        /** Half image checks */
        slideType === MAIN_BANNER_SLIDE_TYPE_ENUM.HALF_IMAGE_WITH_BUTTON ||
        slideType === MAIN_BANNER_SLIDE_TYPE_ENUM.HALF_IMAGE_NO_BUTTON
      ) {
        if (value.title.length > TITLE_HALF_IMAGE_TYPE_MAX_LENGTH) {
          throw new BadRequestError(
            `${value.title} length should be not more then ${TITLE_HALF_IMAGE_TYPE_MAX_LENGTH}`,
          );
        }
      } else if (
        /** Full image checks */
        slideType === MAIN_BANNER_SLIDE_TYPE_ENUM.FULL_IMAGE_WITH_BUTTON ||
        slideType === MAIN_BANNER_SLIDE_TYPE_ENUM.FULL_IMAGE_NO_BUTTON
      ) {
        if (value.title.length > TITLE_FULL_IMAGE_TYPE_MAX_LENGTH) {
          throw new BadRequestError(
            `${value.title} length should be not more then ${TITLE_FULL_IMAGE_TYPE_MAX_LENGTH}`,
          );
        }
      }

      if (
        /** With button checks */
        slideType === MAIN_BANNER_SLIDE_TYPE_ENUM.HALF_IMAGE_WITH_BUTTON ||
        slideType === MAIN_BANNER_SLIDE_TYPE_ENUM.FULL_IMAGE_WITH_BUTTON
      ) {
        if (value.button_name?.length > BUTTON_NAME_MAX_LENGTH) {
          throw new BadRequestError(`${value.button_name} length should be not more then ${BUTTON_NAME_MAX_LENGTH}`);
        }
      }
    }
  }

  private getFormBannerSlideDefaultTextValuesForGetQuery(rows: FormBanner[]): FormBanner[] {
    return rows.map((record) => {
      try {
        const defaultTextValue = record.text_values.find(
          (v) => v.language.is_default === 1 && v.site_domain.is_default === 1,
        );

        record.default_text = defaultTextValue.text || '';
        record.default_cards_count = defaultTextValue.cards?.length || 0;
      } catch (err) {
        log(err);
        record.default_text = '';
        record.default_cards_count = 0;
      }
      return record.toJSON();
    });
  }

  validateTeaserFilesSize(files: Express.Multer.File[]) {
    for (const file of files) {
      if (file.size > MAX_IMAGE_FILE_SIZE) {
        throw new BadRequestError(`${file.originalname} is too large!`);
      }
    }
  }
}
