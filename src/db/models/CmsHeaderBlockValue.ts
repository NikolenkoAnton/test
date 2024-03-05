import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { ApiModelProperty } from 'swagger-express-ts';
import SiteDomain from './SiteDomain';
import TranslateLanguage from './TranslateLanguage';

@Scopes(() => ({
  sorted: {
    order: [['position', 'ASC']],
  },
}))
@Table({ timestamps: false, tableName: 'bb_cms_header_block_value', freezeTableName: true, underscored: true })
export default class CmsHeaderBlockValue extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @ForeignKey(() => TranslateLanguage)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_translate_language', key: 'id' } })
  language_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_site_domain', key: 'id' } })
  site_domain_id: number;

  @Column({ type: DataType.BIGINT, references: { model: 'bb_cms_header_block', key: 'id' } })
  cms_header_block_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @BelongsTo(() => SiteDomain, { targetKey: 'id', foreignKey: 'site_domain_id', as: 'site_domain' })
  site_domain: SiteDomain;

  @BelongsTo(() => TranslateLanguage, { targetKey: 'id', foreignKey: 'language_id', as: 'language' })
  language: TranslateLanguage;
}
