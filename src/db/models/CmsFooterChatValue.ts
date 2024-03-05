import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
} from 'sequelize-typescript';
import SiteDomain from './SiteDomain';
import { ApiModelProperty } from 'swagger-express-ts';
import { CmsFooterLogo } from './index';
import { CustomTable } from './Base';
import TranslateLanguage from './TranslateLanguage';

@CustomTable('bb_cms_footer_chat_value', false)
export default class CmsFooterChatValue extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @ForeignKey(() => CmsFooterLogo)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: 'CmsFooterChat', key: 'id' },
    onDelete: 'CASCADE',
  })
  cms_footer_chat_id: number;

  @ApiModelProperty()
  @Column({
    type: DataType.TEXT('tiny'),
    allowNull: false,
  })
  name: string;

  @ApiModelProperty()
  @ForeignKey(() => SiteDomain)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: 'SiteDomain', key: 'id' },
    onDelete: 'CASCADE',
  })
  site_domain_id: number;

  @ApiModelProperty()
  @ForeignKey(() => TranslateLanguage)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: 'TranslateLanguage', key: 'id' },
    onDelete: 'CASCADE',
  })
  language_id: number;

  @ApiModelProperty()
  @BelongsTo(() => SiteDomain, { targetKey: 'id', foreignKey: 'site_domain_id', as: 'site_domain' })
  site_domain: SiteDomain;

  @ApiModelProperty()
  @BelongsTo(() => TranslateLanguage, { targetKey: 'id', foreignKey: 'language_id', as: 'language' })
  language: TranslateLanguage;
}
