import { Inject, Service } from 'typedi';
import { BOOLEAN_SMALLINT, AddSiteDomainDto, SaveSiteDomainDto } from '../dto';
import SiteDomain from '../db/models/SiteDomain';
import { BadRequestError, NotFoundError, SaveError, ServerError } from '../helper/errors';
import { Transaction, col, fn, where } from 'sequelize';
import { TranslateLanguageService } from './language.service';
import { Model } from 'sequelize-typescript';
import { deleteItem, uploadCmsImage } from '../helper/image';
import { IMAGE_DESTINATION_ENUM, MAX_IMAGE_FILE_SIZE, SITE_DOMAIN_LOGO_TYPES } from '../helper/constants';
import { CmsImage, SiteDomainLogo } from '../db/models';
import CmsImageItem from '../db/models/CmsImageItem';
import { requestImagesValidation } from '../helper/request-validation.helper';

@Service()
export class SettingsService {
  @Inject()
  private readonly languageService: TranslateLanguageService;

  async createSiteDomain(data: AddSiteDomainDto, files, transaction: Transaction): Promise<SiteDomain> {
    const existedUrl = await this.getSiteDomainByUrl(data.url);

    if (existedUrl) {
      throw new BadRequestError('This domain is already exist.');
    }

    const existsSiteDomain = await SiteDomain.findOne({
      where: where(fn('LOWER', col('name')), data.name.toLowerCase()),
      transaction,
    });

    if (existsSiteDomain) {
      throw new BadRequestError(`Site domain with name ${data.name} already exists`);
    }

    if (data.is_default) {
      await this.setAllDomainDefaultAsFalse(transaction);
    }
    const result = await SiteDomain.create(
      {
        name: data.name,
        url: data.url,
        active: data.active,
        is_default: data.is_default,
        big_logo_active: data.big_logo_active,
        small_logo_active: data.small_logo_active,
        favicon_active: data.favicon_active,
      },
      { transaction, returning: true },
    );

    await this.createDomainLogos(result.id, files, transaction);

    return await this.getSiteDomainById(result.id, transaction);
  }

  async getSiteDomains(): Promise<SiteDomain[]> {
    const records = await SiteDomain.findAll({
      include: [
        {
          model: SiteDomainLogo,
          attributes: ['type', 'id'],
          include: [
            {
              model: CmsImageItem,
              attributes: ['uuid', 'extension'],
              include: [{ model: CmsImage, attributes: ['name'] }],
            },
          ],
        },
      ],
      order: [
        ['is_default', 'DESC'],
        ['id', 'ASC'],
      ],
    });

    return records.map((record) => this.addImagesToDomain(record));
  }

  async updateSiteDomain(id: number, data: SaveSiteDomainDto, files, transaction: Transaction): Promise<SiteDomain> {
    await this.checkOnExistedUrlInSiteDomain(id, data);

    if (data.is_default) {
      await this.setAllDomainDefaultAsFalse(transaction);
    }
    await this.updateSiteDomainById(id, data, transaction);
    await this.updateSiteDomainLogo(id, files, transaction);
    await this.destroySiteDomainLogo(id, data.big_logo_destroy, data.small_logo_destroy, transaction);

    return await this.getSiteDomainById(id, transaction);
  }

  private async updateSiteDomainById(id: number, data: SaveSiteDomainDto, transaction: Transaction): Promise<void> {
    const updateData = {
      name: data.name,
      url: data.url,
      active: data.active,
      is_default: data.is_default,
      big_logo_active: data.big_logo_active,
      small_logo_active: data.small_logo_active,
      favicon_active: data.favicon_active,
    };

    await SiteDomain.update(updateData, { where: { id }, transaction });
  }

  private async createDomainLogos(domain_id: number, files, transaction: Transaction): Promise<void> {
    await this.createDomainLogo(domain_id, files.big_logo_image, SITE_DOMAIN_LOGO_TYPES.BIG_LOGO, transaction);
    await this.createDomainLogo(domain_id, files.small_logo_image, SITE_DOMAIN_LOGO_TYPES.SMALL_LOGO, transaction);
    await this.createDomainLogo(domain_id, files.favicon_image, SITE_DOMAIN_LOGO_TYPES.FAVICON, transaction);
  }

  async createDomainLogo(domain_id: number, file, type: SITE_DOMAIN_LOGO_TYPES, transaction: Transaction) {
    const created = await SiteDomainLogo.create(
      {
        type,
        site_domain_id: domain_id,
      },
      { transaction },
    );

    if (file) {
      await uploadCmsImage(created, file, IMAGE_DESTINATION_ENUM.SITE_DOMAIN_LOGO, transaction);
    }
  }

  async getDefaultSettings() {
    const [defaultLanguage, defaultDomain] = await Promise.all([
      this.languageService.getDefaultLanguage(),
      this.getDefaultDomain(),
    ]);

    return { language_id: defaultLanguage.id, site_domain_id: defaultDomain.id };
  }

  async getDefaultValue<T extends Model>(condition: any, model: any, externalTransaction?: Transaction): Promise<T> {
    const { site_domain_id, language_id } = await this.getDefaultSettings();

    const value = await model.findOne({
      where: { ...condition, site_domain_id, language_id },
      transaction: externalTransaction,
    });
    return value;
  }

  async getDefaultDomain(): Promise<SiteDomain> {
    return SiteDomain.findOne({ where: { is_default: 1 } });
  }

  async getSiteDomainByUrl(url: string): Promise<SiteDomain> {
    return await SiteDomain.findOne({ where: { url } });
  }

  async getSiteDomainById(id: number, transaction?: Transaction): Promise<SiteDomain> {
    const record = await SiteDomain.findByPk(id, {
      include: [
        {
          model: SiteDomainLogo,
          attributes: ['type', 'id'],
          include: [
            {
              model: CmsImageItem,
              attributes: ['uuid', 'extension'],
              include: [{ model: CmsImage, attributes: ['name'] }],
            },
          ],
        },
      ],
      transaction,
    });

    return this.addImagesToDomain(record);
  }

  async removeSiteDomainById(id: number, transaction?: Transaction): Promise<any> {
    return await SiteDomain.destroy({ where: { id }, transaction });
  }

  private async checkOnExistedUrlInSiteDomain(id: number, data: SaveSiteDomainDto): Promise<void> {
    const existedUrl = await this.getSiteDomainByUrl(data.url);

    const existed = await this.getSiteDomainById(id);
    if (existedUrl?.id !== existed?.id && existedUrl?.url === data.url) {
      throw new NotFoundError('Duplicate url value.');
    }
    if (existed.is_default && !data.is_default) {
      throw new SaveError('Should be at least one default domain');
    }
    if (existed.is_default && !data.active) {
      throw new SaveError('Default domain could not be inactive');
    }
    if (!data.active && (await this.isOnlyActive(id))) {
      throw new SaveError('Should be at least one active domain');
    }
  }

  private async destroySiteDomainLogo(
    domain_id: number,
    big_logo_destroy: number,
    small_logo_destroy: number,
    transaction: Transaction,
  ) {
    if (big_logo_destroy) {
      const record = await this.getDomainLogoByTypeAndDomain(domain_id, SITE_DOMAIN_LOGO_TYPES.BIG_LOGO, transaction);
      if (record?.cms_image_item_id) {
        await deleteItem(record.cms_image_item_id, IMAGE_DESTINATION_ENUM.SITE_DOMAIN_LOGO);
      }
    }

    if (small_logo_destroy) {
      const record = await this.getDomainLogoByTypeAndDomain(domain_id, SITE_DOMAIN_LOGO_TYPES.SMALL_LOGO, transaction);
      if (record?.cms_image_item_id !== null) {
        await deleteItem(record.cms_image_item_id, IMAGE_DESTINATION_ENUM.SITE_DOMAIN_LOGO);
      }
    }
  }

  private async updateSiteDomainLogo(domain_id: number, files, transaction: Transaction): Promise<void> {
    if (files.big_logo_image) {
      const record = await this.getDomainLogoByTypeAndDomain(domain_id, SITE_DOMAIN_LOGO_TYPES.BIG_LOGO, transaction);
      if (record) {
        await this.destroyDomainLogoWithImage(record, transaction);
      }

      await this.createDomainLogo(domain_id, files.big_logo_image, SITE_DOMAIN_LOGO_TYPES.BIG_LOGO, transaction);
    }

    if (files.small_logo_image) {
      const record = await this.getDomainLogoByTypeAndDomain(domain_id, SITE_DOMAIN_LOGO_TYPES.SMALL_LOGO, transaction);
      if (record) {
        await this.destroyDomainLogoWithImage(record, transaction);
      }

      await this.createDomainLogo(domain_id, files.small_logo_image, SITE_DOMAIN_LOGO_TYPES.SMALL_LOGO, transaction);
    }

    if (files.favicon_image) {
      const record = await this.getDomainLogoByTypeAndDomain(domain_id, SITE_DOMAIN_LOGO_TYPES.FAVICON, transaction);
      if (record) {
        await this.destroyDomainLogoWithImage(record, transaction);
      }

      await this.createDomainLogo(domain_id, files.favicon_image, SITE_DOMAIN_LOGO_TYPES.FAVICON, transaction);
    }
  }

  private async destroyDomainLogoWithImage(record: SiteDomainLogo, transaction: Transaction): Promise<void> {
    if (record.cms_image_item_id !== null) {
      await deleteItem(record.cms_image_item_id, IMAGE_DESTINATION_ENUM.SITE_DOMAIN_LOGO);
    }

    await record.destroy({ transaction });
  }

  private async getDomainLogoByTypeAndDomain(
    site_domain_id: number,
    type: SITE_DOMAIN_LOGO_TYPES,
    transaction: Transaction,
  ): Promise<SiteDomainLogo> {
    return SiteDomainLogo.findOne({
      where: {
        site_domain_id,
        type,
      },
      transaction,
    });
  }

  private async setAllDomainDefaultAsFalse(transaction: Transaction = null): Promise<void> {
    await SiteDomain.update(
      { is_default: BOOLEAN_SMALLINT.FALSE },
      {
        where: { is_default: BOOLEAN_SMALLINT.TRUE },
        transaction,
      },
    );
  }

  async isOnlyActive(id: number): Promise<boolean> {
    const activeDomains = await SiteDomain.scope('onlyActive').findAll({ raw: true });
    return activeDomains.length === 1 && activeDomains[0].id === id;
  }

  private validateSiteDomainLogoFilesSize(files: Express.Multer.File[]) {
    for (const file of files) {
      if (file.size > MAX_IMAGE_FILE_SIZE) {
        throw new BadRequestError(`${file.originalname} is too large!`);
      }
    }
  }

  private addImagesToDomain(record) {
    const edited = record.toJSON();
    edited.big_logo_image = edited.logos.find((logo) => logo.type === SITE_DOMAIN_LOGO_TYPES.BIG_LOGO) || null;
    edited.small_logo_image = edited.logos.find((logo) => logo.type === SITE_DOMAIN_LOGO_TYPES.SMALL_LOGO) || null;
    edited.favicon_image = edited.logos.find((logo) => logo.type === SITE_DOMAIN_LOGO_TYPES.FAVICON) || null;
    delete edited.logos;
    return edited;
  }

  domainImageProcess(req) {
    let files = { big_logo_image: null, small_logo_image: null, favicon_image: null };
    if (req.files) {
      const big_logo_image = req.files['big_logo_image']?.[0];
      const small_logo_image = req.files['small_logo_image']?.[0];
      const favicon_image = req.files['favicon_image']?.[0];
      files = { big_logo_image, small_logo_image, favicon_image };
      const existedFilesArray = Object.values(files).filter((file) => !!file);

      requestImagesValidation(existedFilesArray);
      this.validateSiteDomainLogoFilesSize(existedFilesArray);
    }
    return files;
  }

  async checkDomainOnDelete(id: number): Promise<void> {
    const existed = await this.getSiteDomainById(id);
    if (!existed) {
      throw new NotFoundError('Domain not found');
    }
    if (existed.is_default) {
      throw new ServerError('Should be at least one default domain');
    }
    if (await this.isOnlyActive(id)) {
      throw new ServerError('Should be at least one active domain');
    }
  }
}
