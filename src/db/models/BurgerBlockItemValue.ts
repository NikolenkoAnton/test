import { ApiModelProperty } from 'swagger-express-ts';
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey } from 'sequelize-typescript';
import BurgerBlockItem from './BurgerBlockItem';
import SiteDomain from './SiteDomain';
import TranslateLanguage from './TranslateLanguage';
import { CustomTable } from './Base';

@CustomTable('bb_cms_burger_block_item_value', false)
export default class BurgerBlockItemValue extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @ForeignKey(() => BurgerBlockItem)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_burger_block_item', key: 'id' } })
  burger_block_item_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.BIGINT, references: { model: 'bb_translate_language', key: 'id' } })
  language_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_site_domain', key: 'id' } })
  site_domain_id: number;

  @ApiModelProperty()
  @Column(new DataType.STRING(256))
  url?: string;

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
