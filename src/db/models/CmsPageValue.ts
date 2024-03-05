import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { CmsPage, SiteDomain } from './index';
import TranslateLanguage from './TranslateLanguage';
@ApiModel({
  name: 'CmsPageValue',
})
@Table({ timestamps: false, tableName: 'bb_cms_page_value', freezeTableName: true, underscored: true })
export default class CmsPageValue extends Model {
  @PrimaryKey
  @AutoIncrement
  @ApiModelProperty()
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => CmsPage)
  @Column({ type: DataType.INTEGER, allowNull: false, references: { model: 'bb_cms_page', key: 'id' } })
  @Column(DataType.INTEGER)
  cms_page_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.BIGINT, references: { model: 'bb_translate_language', key: 'id' } })
  @BelongsTo(() => TranslateLanguage, { targetKey: 'id', foreignKey: 'language_id', as: 'language' })
  language_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_site_domain', key: 'id' } })
  @BelongsTo(() => SiteDomain, { targetKey: 'id', foreignKey: 'site_domain_id', as: 'site_domain' })
  site_domain_id: number;

  // @ApiModelProperty() //todo tmp
  // @Column(new DataType.STRING(256))
  // canonical_url: string;

  @ApiModelProperty()
  @Column(new DataType.TEXT())
  title: string;

  @ApiModelProperty()
  @Column(new DataType.TEXT())
  description: string;

  @ApiModelProperty()
  @Column(new DataType.TEXT())
  text: string;

  @ApiModelProperty()
  @Column(new DataType.STRING())
  text_btn: string;

  @ApiModelProperty()
  @Column(new DataType.BOOLEAN())
  index: boolean;

  @ApiModelProperty()
  @Column({ type: new DataType.TEXT(), allowNull: true })
  faq_title: string;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: true, defaultValue: 1 })
  faq_active: number;

  @ApiModelProperty()
  @Column({ type: DataType.TEXT, allowNull: true })
  redirect_target: string;

  @ApiModelProperty({ example: 301 })
  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 301 })
  redirect_type: number;
}
