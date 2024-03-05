import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ApiModelProperty } from 'swagger-express-ts';
import { CustomTable } from './Base';
import SiteDomain from './SiteDomain';
import TranslateLanguage from './TranslateLanguage';

@CustomTable('bb_cms_burger_block_value', false)
export default class BurgerBlockValue extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_burger_block', key: 'id' } })
  burger_block_id: number;

  @ApiModelProperty()
  @ForeignKey(() => TranslateLanguage)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_translate_language', key: 'id' } })
  language_id: number;

  @ApiModelProperty()
  @ForeignKey(() => SiteDomain)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_site_domain', key: 'id' } })
  site_domain_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiModelProperty({ model: 'SiteDomain' })
  @BelongsTo(() => SiteDomain, { targetKey: 'id', foreignKey: 'site_domain_id', as: 'site_domain' })
  site_domain: SiteDomain;

  @ApiModelProperty({ model: 'TranslateLanguage' })
  @BelongsTo(() => TranslateLanguage, { targetKey: 'id', foreignKey: 'language_id', as: 'language' })
  language: TranslateLanguage;
}
