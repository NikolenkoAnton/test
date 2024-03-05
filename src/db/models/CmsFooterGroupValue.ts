import { BelongsTo, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { BaseModel, CustomTable } from './Base';
import SiteDomain from './SiteDomain';
import TranslateLanguage from './TranslateLanguage';

@CustomTable('bb_cms_footer_group_value')
export default class CmsFooterGroupValue extends BaseModel {
  @Column({ type: DataType.BIGINT, references: { model: 'bb_cms_footer_group', key: 'id' } })
  cms_footer_group_id: number;

  @ForeignKey(() => TranslateLanguage)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_translate_language', key: 'id' } })
  language_id: number;

  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_site_domain', key: 'id' } })
  site_domain_id: number;

  @Column({ type: DataType.STRING, allowNull: false, validate: { max: 20 } })
  title: string;

  @BelongsTo(() => SiteDomain, { targetKey: 'id', foreignKey: 'site_domain_id', as: 'site_domain' })
  site_domain: SiteDomain;

  @BelongsTo(() => TranslateLanguage, { targetKey: 'id', foreignKey: 'language_id', as: 'language' })
  language: TranslateLanguage;
}
