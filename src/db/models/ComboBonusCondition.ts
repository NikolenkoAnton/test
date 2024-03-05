import { AutoIncrement, Column, DataType, Model, PrimaryKey } from 'sequelize-typescript';
import { CustomTable } from './Base';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  name: 'ComboBonusCondition',
})
@CustomTable('bb_combo_bonus_condition', false)
export default class ComboBonusCondition extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  // @ForeignKey(() => ComboBonus)
  @ApiModelProperty()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  combo_bonus_id!: number;

  @ApiModelProperty()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  from!: number;

  @ApiModelProperty()
  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  bonus_odds!: number;
}
