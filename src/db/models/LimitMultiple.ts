import { AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ timestamps: false, tableName: 'bb_limit_multiple', freezeTableName: true, underscored: true })
export default class LimitMultiple extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  bet_slip_id: number;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  bet_place_time_delay: number;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  bet_slip_outcome_id: number;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  max_bets: number;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  stop_loss: number;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  max_length: number;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  min_stake: number;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  max_win: number;
}
