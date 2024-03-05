import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey } from 'sequelize-typescript';
import { ApiModelProperty } from 'swagger-express-ts';
import { CustomTable } from './Base';
import { SiteDomain, TranslateLanguage } from './index';
import FormBanner from './FormBanner';

@CustomTable('bb_cms_form_banner_value', false)
export default class FormBannerTextValue extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: 'FormBanner',
      key: 'id',
    },
    onDelete: 'CASCADE',
  })
  @ForeignKey(() => FormBanner)
  form_banner_slide_id: number;

  @ApiModelProperty()
  @ForeignKey(() => TranslateLanguage)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_translate_language', key: 'id' } })
  language_id: number;

  @ApiModelProperty()
  @ForeignKey(() => SiteDomain)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_site_domain', key: 'id' } })
  site_domain_id: number;

  @Column({ type: new DataType.ARRAY(new DataType.STRING()), allowNull: true })
  cards: [string];

  @ApiModelProperty()
  @Column({ type: new DataType.TEXT(), allowNull: false })
  text: string;

  @BelongsTo(() => TranslateLanguage, { targetKey: 'id', foreignKey: 'language_id', as: 'language' })
  language: TranslateLanguage;

  @BelongsTo(() => SiteDomain, { targetKey: 'id', foreignKey: 'site_domain_id', as: 'site_domain' })
  site_domain: SiteDomain;
}
