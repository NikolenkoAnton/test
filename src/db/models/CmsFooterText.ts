import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import CmsFooterBlock from './CmsFooterBlock';
import SiteDomain from './SiteDomain';
import TranslateLanguage from './TranslateLanguage';

@Table({ timestamps: false, tableName: 'bb_cms_footer_text', freezeTableName: true, underscored: true })
export default class CmsFooterText extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => CmsFooterBlock)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: 'CmsFooterBlock', key: 'id' },
    onDelete: 'cascade',
  })
  cms_footer_block_id: number;

  @ForeignKey(() => TranslateLanguage)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_translate_language', key: 'id' }, onDelete: 'cascade' })
  language_id: number;

  @ForeignKey(() => SiteDomain)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_site_domain', key: 'id' }, onDelete: 'cascade' })
  site_domain_id: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  text: string;

  @BelongsTo(() => TranslateLanguage, { targetKey: 'id', foreignKey: 'language_id', as: 'language' })
  language: TranslateLanguage;

  @BelongsTo(() => SiteDomain, { targetKey: 'id', foreignKey: 'site_domain_id', as: 'site_domain' })
  site_domain: SiteDomain;
}
