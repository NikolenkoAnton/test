import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey } from 'sequelize-typescript';
import { CustomTable } from './Base';
import { ApiModelProperty } from 'swagger-express-ts';
import User from './User';

@CustomTable('bb_bet_history_preset', false)
export default class BetHistoryPreset extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @ForeignKey(() => User)
  user_id: number;

  @ApiModelProperty()
  @Column(new DataType.STRING(512))
  name: string;

  @ApiModelProperty()
  @Column(DataType.JSON)
  default_preset?: any;

  @ApiModelProperty()
  @Column(DataType.JSON)
  filter_preset?: any;

  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' })
  user?: User;
}
