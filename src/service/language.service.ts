import { Request } from 'express';
import lodash from 'lodash';
import { Service } from 'typedi';
import { CmsImage, CmsImageItem, UserLog } from '../db/models';
import { BulkUpdate } from '../db/models/Base';
import TranslateLanguage from '../db/models/TranslateLanguage';
import { PatchActiveAndPositionElementDto } from '../dto';
import { IMAGE_DESTINATION_ENUM, USER_LOG_ACTIONS } from '../helper/constants';
import { BadRequestError, SaveError, ServerError } from '../helper/errors';
import { deleteItem, uploadFile } from '../helper/image';
import { CreateLanguageRequest, UpdateLanguageRequest } from '../dto';
import { Op, col, fn, Transaction, where } from 'sequelize';
import { NotFoundError } from 'routing-controllers';

const { find, assign } = lodash;
@Service()
export class TranslateLanguageService {
  async getDefaultLanguage() {
    return TranslateLanguage.findOne({ where: { is_default: 1 } });
  }

  async getLanguages(query: { active?: 0 | 1 }) {
    const where = {};

    if (query?.active !== undefined) {
      where['active'] = query.active;
    }

    return TranslateLanguage.findAll({
      where,
      include: [
        {
          model: CmsImageItem,
          attributes: ['id', 'uuid', 'extension'],
          include: [{ model: CmsImage, attributes: ['name'] }],
        },
      ],
      order: [
        ['is_default', 'DESC'],
        ['position', 'ASC'],
      ],
    });
  }

  async patchManyLanguages(languages: PatchActiveAndPositionElementDto[], request: Request) {
    const defaultLanguage = await this.getDefaultLanguage();

    if (find(languages, { id: defaultLanguage, active: 0 })) {
      throw new BadRequestError();
    }

    await BulkUpdate(TranslateLanguage, languages, ['active', 'position']);

    await UserLog.add(USER_LOG_ACTIONS.TRANSLATE_LANGUAGES_BULK_UPDATE, request);
  }

  async validateLanguage(data: Partial<UpdateLanguageRequest>) {
    if (data.is_default && !data.active) {
      throw new BadRequestError('Default language cannot be inactive');
    }

    const defaultLanguage = await this.getDefaultLanguage();

    if (data.id === defaultLanguage.id && data.active === 0) {
      throw new BadRequestError('Default language cannot be inactive');
    }
  }

  async updateTranslateLanguage(data: UpdateLanguageRequest, icon?: Express.Multer.File) {
    const language = await TranslateLanguage.findByPk(data.id);

    const existsLanguage = await TranslateLanguage.findOne({
      where: { [Op.and]: [where(fn('LOWER', col('short')), data.short.toLowerCase()), { [Op.not]: { id: data.id } }] },
    });

    if (existsLanguage) {
      throw new BadRequestError(`Language with short name ${data.short} already exists`);
    }
    if (icon) {
      if (language.cms_image_item_id) {
        await deleteItem(language.cms_image_item_id, IMAGE_DESTINATION_ENUM.LANGUAGE_ICON);
      }

      const { cms_image_item_id } = await uploadFile(icon, IMAGE_DESTINATION_ENUM.LANGUAGE_ICON);

      language.cms_image_item_id = cms_image_item_id;
    }

    assign(language, data);

    await language.save();

    return language.reload({ include: [{ model: CmsImageItem }] });
  }

  async createTranslateLanguage(data: CreateLanguageRequest, icon: Express.Multer.File) {
    const existsLanguage = await TranslateLanguage.findOne({
      where: where(fn('LOWER', col('short')), data.short.toLowerCase()),
    });

    if (existsLanguage) {
      throw new BadRequestError(`Language with short name ${data.short} already exists`);
    }
    const uploadedFile = await uploadFile(icon, IMAGE_DESTINATION_ENUM.LANGUAGE_ICON);

    const createdLanguage = await TranslateLanguage.create({
      ...data,
      cms_image_item_id: uploadedFile?.cms_image_item_id,
    });

    return createdLanguage.reload({ include: [{ model: CmsImageItem }] });
  }

  private async isOnlyActive(id: number): Promise<boolean> {
    const active = await TranslateLanguage.scope('onlyActive').findAll({ raw: true });
    return active.length === 1 && active[0].id === id;
  }

  async checkLanguageOnDelete(id: number): Promise<void> {
    const existed = await TranslateLanguage.findOne({ where: { id } });
    if (!existed) {
      throw new NotFoundError('Language not found');
    }
    if (existed.is_default) {
      throw new ServerError('Should be at least one default language');
    }
    if (await this.isOnlyActive(id)) {
      throw new ServerError('Should be at least one active language');
    }
  }

  async deleteLanguage(id: number, transaction?: Transaction) {
    await TranslateLanguage.destroy({
      where: {
        id,
      },
      transaction,
    });
  }
}
