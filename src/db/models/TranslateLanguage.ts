import { col, fn, HasManyGetAssociationsMixin, Op } from 'sequelize';
import { BeforeCreate, BeforeUpdate, Column, DataType, Default, HasMany, HasOne, Scopes } from 'sequelize-typescript';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { BaseModel, CustomTable } from './Base';
import CmsImageItem from './CmsImageItem';
import TranslateKeyValue from './TranslateKeyValue';

@ApiModel({
  name: 'TranslateLanguage',
  description: 'Language object from DB',
})
@Scopes(() => ({
  onlyActive: {
    where: { active: 1 },
  },
  sorted: {
    order: [['position', 'ASC']],
  },
  main: {
    attributes: ['id', 'name', 'short'],
  },
}))
@CustomTable('bb_translate_language')
export default class TranslateLanguage extends BaseModel {
  @Column({ type: new DataType.STRING(255), allowNull: false })
  @ApiModelProperty()
  name: string;

  @Column({ type: new DataType.STRING(2), allowNull: false })
  @ApiModelProperty()
  short: string;

  @Default(1)
  @Column({ type: DataType.INTEGER, allowNull: false })
  position: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  @ApiModelProperty()
  active: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  @ApiModelProperty()
  is_default: number;

  @Column(DataType.INTEGER)
  cms_image_item_id?: number;

  @HasOne(() => CmsImageItem, { sourceKey: 'cms_image_item_id', foreignKey: 'id', as: 'cmsImageItem' })
  cmsImageItem?: CmsImageItem;

  static async getDefaultLanguage() {
    return TranslateLanguage.findOne({ where: { is_default: 1 } });
  }

  @BeforeCreate
  static async before(instance: TranslateLanguage, options: any) {
    const {
      dataValues: { maxPosition },
    } = (await TranslateLanguage.findOne({
      attributes: [[fn('MAX', col('position')), 'maxPosition']],
      transaction: options.transactions,
    })) as unknown as { dataValues: { maxPosition: number } };

    instance.position = maxPosition + 1;

    if (instance.is_default) {
      await TranslateLanguage.update(
        { is_default: 0 },
        { where: { is_default: 1 }, transaction: options.transactions },
      );
    }
  }

  @BeforeUpdate
  static async beforeUpdateHook(instance: TranslateLanguage, options: any) {
    if (instance.is_default) {
      await TranslateLanguage.update(
        { is_default: 0 },
        { where: { is_default: 1, id: { [Op.not]: instance.id } }, transaction: options.transactions },
      );
    }
  }

  @HasMany(() => TranslateKeyValue, { sourceKey: 'id', foreignKey: 'language_id', as: 'translateKeyValues' })
  getTranslateKeyValues: HasManyGetAssociationsMixin<TranslateKeyValue>;
}
