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
import { ApiModelProperty } from 'swagger-express-ts';
import CmsPage from './CmsPage';
import SiteDomain from './SiteDomain';
import TranslateLanguage from './TranslateLanguage';

@Table({ timestamps: false, tableName: 'bb_cms_page_faq_question', freezeTableName: true, underscored: true })
export default class CmsPageFAQQuestion extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => CmsPage)
  @Column({ type: DataType.INTEGER, allowNull: false, references: { model: 'bb_cms_page', key: 'id' } })
  @Column(DataType.INTEGER)
  cms_page_id: number;

  @ApiModelProperty()
  @Column({ type: new DataType.TEXT(), allowNull: false })
  question: string;

  @ApiModelProperty()
  @Column({ type: new DataType.TEXT(), allowNull: false })
  answer: string;

  @ApiModelProperty()
  @Default(100)
  @Column({ type: DataType.INTEGER, allowNull: false })
  position: number;

  @ApiModelProperty()
  @Column({ type: DataType.BIGINT, references: { model: 'bb_translate_language', key: 'id' } })
  @BelongsTo(() => TranslateLanguage, { targetKey: 'id', foreignKey: 'language_id', as: 'language' })
  language_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_site_domain', key: 'id' } })
  @BelongsTo(() => SiteDomain, { targetKey: 'id', foreignKey: 'site_domain_id', as: 'site_domain' })
  site_domain_id: number;
}
