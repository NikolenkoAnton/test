import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey } from 'sequelize-typescript';

import { CustomTable } from './Base';
import SiteDomain from './SiteDomain';
import TranslateLanguage from './TranslateLanguage';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  name: 'ComboBonusValue',
})
@CustomTable('bb_combo_bonus_value', false)
export default class ComboBonusValue extends Model {
  @PrimaryKey
  @AutoIncrement
  @ApiModelProperty()
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  // @ForeignKey(() => ComboBonus)
  @Column({ type: DataType.INTEGER, allowNull: false })
  combo_bonus_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiModelProperty()
  @ForeignKey(() => SiteDomain)
  @Column({ type: DataType.INTEGER, allowNull: false })
  site_domain_id: number;

  @ApiModelProperty()
  @ForeignKey(() => TranslateLanguage)
  @Column({ type: DataType.INTEGER, allowNull: false })
  language_id: number;

  //   @BelongsTo(() => ComboBonus, { targetKey: 'id', foreignKey: 'combo_bonus_id', as: 'combo_bonus' })
  //   combo_bonus: ComboBonus;

  @BelongsTo(() => SiteDomain, { targetKey: 'id', foreignKey: 'site_domain_id', as: 'site_domain' })
  site_domain: SiteDomain;

  @BelongsTo(() => TranslateLanguage)
  translate_language: TranslateLanguage;
}
