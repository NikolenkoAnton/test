import { Request } from 'express';
import { extname } from 'path';
import { Sequelize, Transaction, WhereOptions, col, fn } from 'sequelize';
import { Inject, Service } from 'typedi';
import {
  Category,
  CmsFooterBlock,
  CmsFooterChat,
  CmsFooterChatValue,
  CmsFooterGroup,
  CmsFooterGroupElement,
  CmsFooterLogoValue,
  CmsFooterText,
  CmsFooterValidatorValue,
  CmsImage,
  CmsPageFAQQuestion,
  CmsPageValue,
  Competition,
  CompetitionTop,
  FormBanner,
  MainBannerSlide,
  SiteDomain,
  Sport,
  StaticPage,
  StaticPageTemplate,
  Teaser,
  TranslateLanguage,
  UserLog,
} from '../db/models';
import CmsFile from '../db/models/CmsFile';
import CmsFooterLogo from '../db/models/CmsFooterLogo';
import CmsFooterValidator from '../db/models/CmsFooterValidator';
import CmsImageItem from '../db/models/CmsImageItem';
import CmsPage from '../db/models/CmsPage';
import SiteDomainLogo from '../db/models/SiteDomainLogo';
import StaticPageValue from '../db/models/StaticPageValue';
import {
  BOOLEAN_SMALLINT,
  ChoosePreviousImagesDto,
  ChoosePreviousImagesMultipleRecordsDto,
  ChoosePreviousImagesValuesDto,
  CmsFooterTextBlockValueDto,
  GetCmsFooterChatResponseDto,
  GetCmsFooterValidatorResponseDto,
  GetSportListDto,
  GetTeaserDto,
  OrderSportListDataDto,
  OrderSportListDto,
  SaveCmsFile,
  SaveCmsFooterLogoBlockDto,
  SaveCmsFooterValidatorBlockDto,
  SavePageDto,
  SuccessStatusResponse,
} from '../dto';
import { deletePublicFile, uploadPublicFile } from '../helper/cms';
import {
  ALLOWED_LOGO_IMAGE_MIMETYPES,
  ENTITY_NAME,
  IMAGE_DESTINATION_ENUM,
  MAX_LOGO_FILE_SIZE,
  PRVEIOUS_IMAGES_CHOOSE_MODE_ENUM,
  USER_LOG_ACTIONS,
} from '../helper/constants';
import { BadRequestError, NotFoundError, SaveError } from '../helper/errors';
import { deleteItem, removeEntityCmsImageGallery, uploadCmsImage } from '../helper/image';
import { ALLOWED_PUBLIC_FILES_FORMATS } from '../helper/request-validation.helper';
import { chooseFile, deleteFile, relateExistingCmsGalleryItems } from '../helper/image';
import { SettingsService } from './settings.service';
import EntityOrder from '../db/models/EntityOrder';

import { orderBy } from 'lodash';

@Service()
export class CmsService {
  @Inject()
  private settingsService: SettingsService;

  private modelToImageSectionMap: Map<IMAGE_DESTINATION_ENUM, any> = new Map()
    .set(IMAGE_DESTINATION_ENUM.TOP_COMPETITION, CompetitionTop)
    .set(IMAGE_DESTINATION_ENUM.TEASER, Teaser)
    .set(IMAGE_DESTINATION_ENUM.CMS_FOOTER_LOGO, CmsFooterLogoValue)
    .set(IMAGE_DESTINATION_ENUM.MAIN_BANNER_SLIDE, MainBannerSlide)
    .set(IMAGE_DESTINATION_ENUM.FORM_BANNER_SLIDE, FormBanner)
    .set(IMAGE_DESTINATION_ENUM.LANGUAGE_ICON, TranslateLanguage)
    .set(IMAGE_DESTINATION_ENUM.SITE_DOMAIN_LOGO, SiteDomainLogo);

  async createCmsFooterTextBlockItem(
    data: CmsFooterTextBlockValueDto[],
    blockId: number,
    externalTransaction?: Transaction,
  ) {
    const existed = await CmsFooterText.findOne({ where: { cms_footer_block_id: blockId } });
    if (existed) {
      throw new BadRequestError('Footer text for this block already created');
    }
    await Promise.all(
      data.map((value) =>
        CmsFooterText.create(
          {
            cms_footer_block_id: blockId,
            site_domain_id: value.site_domain_id,
            language_id: value.language_id,
            text: value.text,
          },
          { transaction: externalTransaction },
        ),
      ),
    );
  }

  async updateCmsFooterTextBlockItem(
    data: CmsFooterTextBlockValueDto[],
    blockId: number,
    externalTransaction?: Transaction,
  ) {
    await CmsFooterText.destroy({
      where: { cms_footer_block_id: blockId },
      transaction: externalTransaction,
    });

    await Promise.all(
      data.map((value) =>
        CmsFooterText.create(
          {
            cms_footer_block_id: blockId,
            site_domain_id: value.site_domain_id,
            language_id: value.language_id,
            text: value.text,
          },
          { transaction: externalTransaction },
        ),
      ),
    );
  }

  async getCmsFooterTexts(id: number) {
    const values = await CmsFooterText.findAll({
      where: {
        cms_footer_block_id: id,
      },
      attributes: ['cms_footer_block_id', 'language_id', 'site_domain_id', 'text'],
      include: [
        { model: TranslateLanguage, attributes: ['name', 'short'] },
        { model: SiteDomain, attributes: ['url'] },
      ],
      order: [['id', 'ASC']],
    });

    return {
      id,
      values,
    };
  }

  async removeCmsFooterTexts(id: number, externalTransaction?: Transaction) {
    await CmsFooterText.destroy({ where: { cms_footer_block_id: id }, transaction: externalTransaction });
  }

  public async recalculateBlocksPositions(transaction?: Transaction) {
    const blocks = await CmsFooterBlock.scope('sorted').findAll({ transaction });

    await Promise.all(
      blocks.map(async (block: CmsFooterBlock, index: number) => {
        block.position = index + 1;

        await block.save({ fields: ['position'], transaction });
      }),
    );
  }

  public async recalculateGroupsPositions(cms_footer_block_id: number, transaction?: Transaction) {
    const groups = await CmsFooterGroup.scope('sorted').findAll({ where: { cms_footer_block_id }, transaction });

    await Promise.all(
      groups.map(async (group: CmsFooterGroup, index: number) => {
        group.position = index + 1;

        await group.save({ fields: ['position'], transaction });
      }),
    );
  }

  public async recalculateElementsPositions(cms_footer_group_id: number, transaction?: Transaction) {
    const elements = await CmsFooterGroupElement.scope('sorted').findAll({
      where: { cms_footer_group_id },
      transaction,
    });

    await Promise.all(
      elements.map(async (element: CmsFooterGroupElement, index: number) => {
        element.position = index + 1;

        await element.save({ fields: ['position'], transaction });
      }),
    );
  }

  //#region Logo block actions
  public async createCmsFooterLogo(data: SaveCmsFooterLogoBlockDto, images: any, transaction?: Transaction) {
    const created = await CmsFooterLogo.create(
      {
        title: data.title,
        cms_footer_block_id: data.cms_footer_block_id,
        position: data.position,
        active: data.active,
      },
      { transaction },
    );

    await this.createCmsFooterLogoValues(data.values, created, images, transaction);
  }
  public async updateCmsFooterLogo(
    data: SaveCmsFooterLogoBlockDto,
    images: any,
    id: number,
    transaction?: Transaction,
  ) {
    const record = await CmsFooterLogo.findByPk(id);
    if (!record) {
      throw new NotFoundError('Logo is not found');
    }

    await record.update(
      {
        title: data.title,
        cms_footer_block_id: data.cms_footer_block_id,
        position: data.position,
        active: data.active,
      },
      { transaction },
    );

    await this.destroyCmsFooterLogoValues(id, transaction);
    await this.createCmsFooterLogoValues(data.values, record, images, transaction);
  }

  public async getCmsFooterLogo(blockId: number) {
    const values = await CmsFooterLogo.findAll({
      where: {
        cms_footer_block_id: blockId,
      },
      include: [
        {
          model: CmsFooterLogoValue,
          include: [
            {
              model: CmsImageItem,
              attributes: ['uuid', 'extension'],
              include: [{ model: CmsImage, attributes: ['name', 'id'] }],
            },
            {
              model: SiteDomain,
              attributes: ['url'],
            },
          ],
        },
      ],
      order: [
        ['position', 'ASC'],
        ['id', 'ASC'],
      ],
    });

    return {
      id: blockId,
      values,
    };
  }

  async deleteCmsFooterLogo(id: number, transaction?: Transaction) {
    const record = await CmsFooterLogo.findByPk(id);
    if (!record) {
      throw new NotFoundError(`Logo is not found`);
    }

    await this.destroyCmsFooterLogoValues(id, transaction);
    await record.destroy({ transaction });
  }

  private async createCmsFooterLogoValues(values, footerLogo: CmsFooterLogo, images: any, transaction?: Transaction) {
    if (!values.length) {
      return;
    }
    for (const [index, value] of values.entries()) {
      if (value.image_from_url && !value.image_url) {
        throw new SaveError(`image_url is required for record ${index}`);
      }
      const createdValue = await CmsFooterLogoValue.create(
        {
          cms_footer_logo_id: footerLogo.id,
          site_domain_id: value.site_domain_id,
          url: value.url,
        },
        { transaction },
      );
      const image = images.find((i) => i.fieldname.match(/\d+/) == index);
      if (image) {
        await uploadCmsImage(createdValue, image, IMAGE_DESTINATION_ENUM.CMS_FOOTER_LOGO, transaction);
      }
    }
  }

  private async destroyCmsFooterLogoValues(logoId: number, transaction?: Transaction) {
    const logoValues = await CmsFooterLogoValue.findAll({ where: { cms_footer_logo_id: logoId }, transaction });

    for (const value of logoValues) {
      if (value.cms_image_item_id) {
        await deleteItem(value.cms_image_item_id, IMAGE_DESTINATION_ENUM.CMS_FOOTER_LOGO);
      }
      await value.destroy({ transaction });
    }
  }

  private async relatePreviousOneImage(record, section: IMAGE_DESTINATION_ENUM, imageId) {
    if (record.cms_image_item_id !== null) {
      await deleteItem(record.cms_image_item_id, section);
    }

    const cmsImage = await CmsImage.findByPk(imageId);

    if (!cmsImage) {
      //error  file not found
      throw new Error('file not found');
    }

    const cms_image_item_id = await chooseFile(cmsImage);

    record.cms_image_item_id = cms_image_item_id;
    await record.save();
  }

  public async relatePreviousImageWithEntityValues(data: ChoosePreviousImagesValuesDto) {
    for (const value of data.values) {
      const record = await this.modelToImageSectionMap.get(data.section).findByPk(value.id);
      await this.relatePreviousOneImage(record, data.section, value.image_id);
    }
  }

  public async relatePreviousImagesWithEntities(params: ChoosePreviousImagesMultipleRecordsDto) {
    if (!params.data.length) {
      return;
    }

    for (const el of params.data) {
      await this.relatePreviousImageWithEntity(el);
    }
  }

  public async relatePreviousImageWithEntity(data: ChoosePreviousImagesDto) {
    const record = await this.modelToImageSectionMap.get(data.section).findByPk(data.id);

    if (!record) {
      throw new NotFoundError();
    }

    if (data.image_ids) {
      if (data.mode === PRVEIOUS_IMAGES_CHOOSE_MODE_ENUM.REPLACE) {
        await removeEntityCmsImageGallery(record, data.section as IMAGE_DESTINATION_ENUM);
      }

      await relateExistingCmsGalleryItems(record.id, data.image_ids, data.section as IMAGE_DESTINATION_ENUM);
      return;
    }

    if (data.image_id) {
      await this.relatePreviousOneImage(record, data.section, data.image_id);
    }
  }

  public async deletePreviousImage(cms_image_id: number) {
    const cms_image = await CmsImage.findOne({
      attributes: {
        include: [[fn('COUNT', col('cmsImageItem.id')), 'itemCount']],
      },
      include: [
        {
          model: CmsImageItem,
          attributes: [],
        },
      ],
      where: { id: cms_image_id },
      group: ['CmsImage.id'],
    });

    if (!cms_image) {
      throw new NotFoundError();
    } else if ((cms_image.get('itemCount') as unknown as number) > 0) {
      throw new BadRequestError();
    }

    await deleteFile(cms_image);
  }
  //#endregion

  //#region Static Page
  async createStaticPage(body, existedSlug, defaultDomain, pagePayload, t: Transaction = null) {
    if (existedSlug) {
      throw new BadRequestError(`Slug ${body.slug} is already existed`);
    }
    const page = await StaticPage.create(pagePayload, { transaction: t, returning: true });

    await Promise.all(
      body.values.map((value) => {
        StaticPageValue.create(
          {
            language_id: value.language_id,
            site_domain_id: value.site_domain_id ? value.site_domain_id : defaultDomain.id,
            text: value.text,
            cms_static_page_id: page.id,
            custom_css: value.custom_css,
          },
          { transaction: t },
        );
      }),
    );
  }

  async updateStaticPage(body, existedSlug, defaultDomain, pagePayload, t: Transaction = null) {
    const pageId = body.id;
    const existedPage = await StaticPage.findByPk(pageId);
    if (!existedPage) {
      throw new NotFoundError(`Page ${pageId} is not found`);
    }
    if (existedSlug && existedPage.slug !== pagePayload.slug) {
      throw new BadRequestError(`Slug ${pagePayload.slug} is already existed`);
    }

    await StaticPage.update(pagePayload, { where: { id: pageId }, transaction: t });

    if (body.values.length) {
      await StaticPageValue.destroy({ where: { cms_static_page_id: pageId }, transaction: t });

      await Promise.all(
        body.values.map((value) => {
          StaticPageValue.create(
            {
              text: value.text,
              site_domain_id: value.site_domain_id ? value.site_domain_id : defaultDomain.id,
              language_id: value.language_id,
              cms_static_page_id: pageId,
              custom_css: value.custom_css,
            },
            { transaction: t },
          );
        }),
      );
    }
  }

  async getStaticPage(where: WhereOptions, page: number, perPage: number) {
    const count = await StaticPage.count({ where });

    const rows = await StaticPage.findAll({
      where,
      order: [['id', 'DESC']],
      limit: perPage,
      offset: (page - 1) * perPage,
      include: [
        {
          model: StaticPageTemplate,
        },
        {
          model: StaticPageValue,
          attributes: {
            exclude: ['id', 'cms_static_page_id', 'custom_css', 'text'],
            include: [[Sequelize.literal(`CASE WHEN text IS NULL or TEXT = '' THEN true ELSE false END`), 'is_empty']],
          },
          include: [
            {
              model: TranslateLanguage,
              attributes: ['short'],
            },
            {
              model: SiteDomain,
              attributes: ['url'],
            },
          ],
        },
      ],
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
      pages: Math.ceil(count / perPage),
      current_page: page,
    };
  }

  async getOneStaticPage(id: number): Promise<StaticPage> {
    return StaticPage.findByPk(id, {
      include: [
        {
          model: StaticPageTemplate,
        },
        {
          model: StaticPageValue,
          attributes: { exclude: ['id', 'cms_static_page_id'] },
          include: [
            {
              model: TranslateLanguage,
              attributes: ['short'],
            },
            {
              model: SiteDomain,
              attributes: ['url'],
            },
          ],
        },
      ],
      order: [['id', 'DESC']],
    });
  }
  //#endregion

  validateLogoFiles(files: any = []) {
    for (const file of files) {
      if (file.size > MAX_LOGO_FILE_SIZE) {
        throw new BadRequestError(`${file.originalname} is too large!`);
      }
      if (!ALLOWED_LOGO_IMAGE_MIMETYPES.includes(file.mimetype)) {
        throw new BadRequestError(`${file.mimetype} is not a supported file type!`);
      }
    }
  }

  async createPage(data: SavePageDto, transaction?: Transaction) {
    const createdPage = await CmsPage.create(
      {
        url: data.url,
      },
      { transaction },
    );

    await this.createPageValues(data.values, createdPage.id, transaction);

    return createdPage;
  }

  async checkPageUrl(data: SavePageDto) {
    const pageId = data.id;
    if (!pageId) {
      const existed = await CmsPage.findOne({ where: { url: data.url } });
      if (existed) {
        throw new BadRequestError(`Page with url ${data.url} already exists`);
      }
    } else {
      const existed = await CmsPage.findByPk(pageId);
      if (!existed) {
        throw new NotFoundError(`Page ${pageId} is not found`);
      }

      const existedUrl = await CmsPage.findOne({ where: { url: data.url } });
      if (existedUrl && existed.url !== data.url) {
        throw new BadRequestError(`Page with url ${data.url} is already existed`);
      }
    }
  }

  async updatePage(data: SavePageDto, transaction?: Transaction) {
    await CmsPage.update(data, { where: { id: data.id }, transaction });
    const page = await CmsPage.findByPk(data.id, { transaction });

    await CmsPageValue.destroy({ where: { cms_page_id: page.id }, transaction });
    await CmsPageFAQQuestion.destroy({ where: { cms_page_id: page.id }, transaction });

    await this.createPageValues(data.values, page.id, transaction);
  }

  async createPageValues(values, pageId, transaction) {
    const promises = [];
    for (const value of values) {
      promises.push(
        CmsPageValue.create(
          {
            index: value.index,
            faq_title: value.faq_title,
            faq_active: value.faq_active,
            language_id: value.language_id,
            site_domain_id: value.site_domain_id,
            title: value.title,
            description: value.description,
            text: value.text,
            text_btn: value.text_btn,
            redirect_type: value.redirect_type,
            redirect_target: value.redirect_target,
            cms_page_id: pageId,
          },
          { transaction },
        ),
      );

      if (value.faq_questions?.length) {
        for (const question of value.faq_questions) {
          promises.push(
            CmsPageFAQQuestion.create(
              {
                question: question.question,
                answer: question.answer,
                position: question.position,
                language_id: value.language_id,
                site_domain_id: value.site_domain_id,
                cms_page_id: pageId,
              },
              { transaction },
            ),
          );
        }
      }
    }

    await Promise.all(promises);
  }

  async getPage(id) {
    const page = await CmsPage.findByPk(id, {
      include: [
        {
          model: CmsPageValue,
          attributes: {
            exclude: ['cms_page_id'],
          },
          include: [
            { model: SiteDomain, attributes: ['name', 'url'] },
            { model: TranslateLanguage, attributes: ['name', 'short'] },
          ],
        },
      ],
    });

    if (!page) {
      throw new NotFoundError('Page is not found');
    }

    const data = page.get({ plain: true });
    const questions = await CmsPageFAQQuestion.findAll({
      where: { cms_page_id: id },
      attributes: { exclude: ['cms_page_id'] },
    });

    data.values.map((value) => {
      value.faq_questions = questions.filter(
        (question) => question.site_domain_id === value.site_domain_id && question.language_id === value.language_id,
      );
    });

    return data;
  }

  async deletePage(page, t: Transaction, req: Request) {
    await CmsPageFAQQuestion.destroy({ where: { cms_page_id: page.id }, transaction: t });
    await CmsPageValue.destroy({ where: { cms_page_id: page.id }, transaction: t });
    await page.destroy({ transaction: t });
    await UserLog.add(USER_LOG_ACTIONS.CMS_DELETE_PAGE, req, t);
  }

  async getPages(where, page, perPage) {
    const count = await CmsPage.count({ where });

    const defaultDomain = await this.settingsService.getDefaultDomain();
    const rows = await CmsPage.findAll({
      where,
      include: [
        {
          model: CmsPageValue,
          attributes: ['index'],
          where: { site_domain_id: defaultDomain.id },
          include: [
            {
              model: TranslateLanguage,
              attributes: ['short'],
            },
          ],
        },
      ],
      attributes: ['id', 'url'],
      order: [['id', 'ASC']],
      limit: perPage,
      offset: (page - 1) * perPage,
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
      pages: Math.ceil(count / perPage),
      current_page: page,
    };
  }

  //#region Chat block actions
  async createCmsFooterChat(data, transaction?: Transaction) {
    const existed = await CmsFooterChat.findOne({ where: { cms_footer_block_id: data.cms_footer_block_id } });
    if (existed) {
      throw new BadRequestError('Chat for this block already created');
    }

    const created = await CmsFooterChat.create(
      {
        cms_footer_block_id: data.cms_footer_block_id,
      },
      { transaction },
    );

    await Promise.all(
      data.values.map((value) =>
        CmsFooterChatValue.create(
          {
            cms_footer_chat_id: created.id,
            name: value.name,
            site_domain_id: value.site_domain_id,
            language_id: value.language_id,
          },
          { transaction },
        ),
      ),
    );
  }

  async getCmsFooterChat(blockId): Promise<GetCmsFooterChatResponseDto> {
    const values = await CmsFooterChat.findAll({
      where: {
        cms_footer_block_id: blockId,
      },
      include: [
        {
          model: CmsFooterChatValue,
          include: [
            { model: TranslateLanguage.scope('onlyActive'), attributes: ['name', 'short'] },
            { model: SiteDomain.scope('onlyActive'), attributes: ['url'] },
          ],
        },
      ],
      order: [['id', 'ASC']],
    });

    return {
      id: blockId,
      values,
    };
  }

  async updateCmsFooterChat(data, transaction?: Transaction) {
    const existed = await CmsFooterChat.findByPk(data.id);
    if (!existed) {
      throw new NotFoundError();
    }

    await CmsFooterChatValue.destroy({ where: { cms_footer_chat_id: existed.id }, transaction });

    await Promise.all(
      data.values.map((value) =>
        CmsFooterChatValue.create(
          {
            cms_footer_chat_id: existed.id,
            name: value.name,
            site_domain_id: value.site_domain_id,
            language_id: value.language_id,
          },
          { transaction },
        ),
      ),
    );
  }

  async deleteCmsFooterChat(id: number, transaction: Transaction) {
    const record = await CmsFooterChat.findByPk(id);
    if (!record) {
      throw new NotFoundError();
    }

    await CmsFooterChatValue.destroy({ where: { cms_footer_chat_id: record.id }, transaction });
    await record.destroy({ transaction });
  }

  //#endregion

  //#region validator block actions
  async createCmsFooterValidator(data: SaveCmsFooterValidatorBlockDto, transaction?: Transaction) {
    const existed = await CmsFooterValidator.findOne({ where: { cms_footer_block_id: data.cms_footer_block_id } });
    if (existed) {
      throw new BadRequestError('Validator for this block already created');
    }

    const created = await CmsFooterValidator.create(
      {
        cms_footer_block_id: data.cms_footer_block_id,
      },
      { transaction },
    );

    await Promise.all(
      data.values.map((value) =>
        CmsFooterValidatorValue.create(
          {
            active: value.active,
            cms_footer_validator_id: created.id,
            seals_id: value.seals_id,
            site_domain_id: value.site_domain_id,
          },
          { transaction },
        ),
      ),
    );
  }

  async updateCmsFooterValidator(data: SaveCmsFooterValidatorBlockDto, transaction?: Transaction) {
    const existed = await CmsFooterValidator.findByPk(data.id);
    if (!existed) {
      throw new NotFoundError();
    }

    await CmsFooterValidatorValue.destroy({ where: { cms_footer_validator_id: existed.id }, transaction });

    await Promise.all(
      data.values.map((value) =>
        CmsFooterValidatorValue.create(
          {
            active: value.active,
            cms_footer_validator_id: existed.id,
            seals_id: value.seals_id,
            site_domain_id: value.site_domain_id,
          },
          { transaction },
        ),
      ),
    );
  }

  async getCmsFooterValidator(blockId): Promise<GetCmsFooterValidatorResponseDto> {
    const values = await CmsFooterValidator.findAll({
      where: {
        cms_footer_block_id: blockId,
      },
      include: [
        {
          model: CmsFooterValidatorValue,
          include: [{ model: SiteDomain, where: { active: BOOLEAN_SMALLINT.TRUE }, attributes: ['url'] }],
        },
      ],
      order: [['id', 'ASC']],
    });

    return {
      id: blockId,
      values,
    };
  }

  async deleteCmsFooterValidator(id: number, transaction: Transaction) {
    const record = await CmsFooterValidator.findByPk(id);
    if (!record) {
      throw new NotFoundError();
    }

    await CmsFooterValidatorValue.destroy({ where: { cms_footer_validator_id: record.id }, transaction });
    await record.destroy({ transaction });
  }
  //#endregion

  async createCmsFile(data: SaveCmsFile, file: Express.Multer.File, transaction: Transaction) {
    const { name } = data;
    const { fileName, ext } = await uploadPublicFile(file);

    await CmsFile.create(
      {
        name,
        uuid: fileName,
        extension: ext,
      },
      { transaction },
    );
  }

  async getPublicFiles(where: WhereOptions, page: number, perPage: number) {
    const count = await CmsFile.count({ where });

    const rows = await CmsFile.scope('sorted').findAll({
      where,
      order: [['id', 'ASC']],
      limit: perPage,
      offset: (page - 1) * perPage,
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
      pages: Math.ceil(count / perPage),
      current_page: page,
    };
  }

  async deletePublicFile(id: number, transaction: Transaction) {
    const record = await CmsFile.findByPk(id);
    if (!record) {
      throw new NotFoundError('File is not found');
    }

    await deletePublicFile(record);

    await record.destroy({ transaction });
  }

  async getSportList(params: GetSportListDto): Promise<OrderSportListDataDto> {
    const lang = params.language_id;

    const nestedSports = await this.getNestedSports(params, lang);
    const orderByLang = await EntityOrder.findAll({ where: { language_id: lang } });

    const cloned: any = nestedSports.map((s) => s.toJSON());

    for (const sport of cloned) {
      const sportOrderByLang = orderByLang.find((l) => l.entity === ENTITY_NAME.SPORT && l.entity_id === sport.id);
      sport.position = sportOrderByLang ? sportOrderByLang.position : null;
      sport.favorite = sportOrderByLang ? sportOrderByLang.favorite : 0;

      for (const category of sport.categories) {
        const categoryOrderByLang = orderByLang.find(
          (l) => l.entity === ENTITY_NAME.CATEGORY && l.entity_id === category.id,
        );
        category.position = categoryOrderByLang ? categoryOrderByLang.position : null;
        category.favorite = categoryOrderByLang ? categoryOrderByLang.favorite : 0;

        for (const competition of category.competitions) {
          const competitionOrderByLang = orderByLang.find(
            (l) => l.entity === ENTITY_NAME.COMPETITION && l.entity_id === competition.id,
          );
          competition.position = competitionOrderByLang ? competitionOrderByLang.position : null;
          competition.favorite = competitionOrderByLang ? competitionOrderByLang.favorite : 0;
        }
      }
    }

    const orderedSports = this.orderNestedSportList(cloned);

    const result: OrderSportListDataDto = {
      language_id: lang,
      sports: orderedSports.map((sport) => {
        return {
          id: sport.id,
          position: sport.position,
          favorite: sport.favorite,
          name: sport.name,
          categories: sport.categories.map((category) => {
            return {
              id: category.id,
              position: category.position,
              favorite: category.favorite,
              name: category.name,
              competitions: category.competitions.map((competition) => {
                return {
                  id: competition.id,
                  position: competition.position,
                  favorite: competition.favorite,
                  name: competition.name,
                };
              }),
            };
          }),
        };
      }),
    };

    return result;
  }

  private async getNestedSports(params: GetSportListDto, languageId: number) {
    const where: any = {};

    if (params.sport_id) {
      where.id = params.sport_id;
    }

    return Sport.findAll({
      attributes: [['en', 'name'], 'id'],
      where,
      include: [
        {
          model: Category,
          attributes: [['en', 'name'], 'id'],
          where: params.category_id ? { id: params.category_id } : {},
          required: false,
          include: [
            {
              model: Competition,
              attributes: [['en', 'name'], 'id'],
              where: params.competition_id ? { id: params.competition_id } : {},
              required: false,
            },
          ],
        },
      ],
    });
  }

  private orderNestedSportList(data: any) {
    const result = orderBy(data, ['favorite', 'position', 'name'], ['desc', 'asc', 'asc']);
    for (const sport of result) {
      sport.categories = orderBy(sport.categories, ['favorite', 'position', 'name'], ['desc', 'asc', 'asc']);
      for (const category of sport.categories) {
        category.competitions = orderBy(
          category.competitions,
          ['favorite', 'position', 'name'],
          ['desc', 'asc', 'asc'],
        );
      }
    }

    return result;
  }

  async orderSportList(data: OrderSportListDataDto): Promise<unknown> {
    const toSave = [];

    const language_id = data.language_id;
    for (const sport of data.sports) {
      this.pushEntityToSave(toSave, language_id, ENTITY_NAME.SPORT, sport.id, sport.position, sport.favorite);

      for (const category of sport.categories) {
        this.pushEntityToSave(
          toSave,
          language_id,
          ENTITY_NAME.CATEGORY,
          category.id,
          category.position,
          category.favorite,
        );

        for (const competition of category.competitions) {
          this.pushEntityToSave(
            toSave,
            language_id,
            ENTITY_NAME.COMPETITION,
            competition.id,
            competition.position,
            competition.favorite,
          );
        }
      }
    }

    return EntityOrder.bulkCreate(toSave, {
      updateOnDuplicate: ['position', 'favorite'],
    });
  }

  private pushEntityToSave(
    toSave: any[],
    language_id: number,
    entity: string,
    entity_id: number,
    position: number,
    favorite: number,
  ) {
    toSave.push({
      language_id,
      entity,
      entity_id,
      position,
      favorite,
    });
  }

  publicFilesValidation = (file: Express.Multer.File) => {
    const fileExtension = extname(file.originalname).slice(1);

    if (!ALLOWED_PUBLIC_FILES_FORMATS.includes(fileExtension)) {
      throw new BadRequestError(`You cannot upload image with extension ${fileExtension}`);
    }
  };
}
