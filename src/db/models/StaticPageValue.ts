import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { SiteDomain, TranslateLanguage } from './index';

@Table({ timestamps: false, tableName: 'bb_cms_static_page_value', freezeTableName: true, underscored: true })
export default class StaticPageValue extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  // @ForeignKey(() => StaticPage)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_cms_static_page', key: 'id' } })
  cms_static_page_id: number;

  @ForeignKey(() => TranslateLanguage)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_translate_language', key: 'id' } })
  language_id: number;

  @ForeignKey(() => SiteDomain)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_site_domain', key: 'id' } })
  site_domain_id: number;

  @Column({ type: new DataType.TEXT(), allowNull: false })
  text: string;

  @BelongsTo(() => TranslateLanguage, { targetKey: 'id', foreignKey: 'language_id', as: 'language' })
  language: TranslateLanguage;

  @BelongsTo(() => SiteDomain, { targetKey: 'id', foreignKey: 'site_domain_id', as: 'site_domain' })
  site_domain: SiteDomain;
}
