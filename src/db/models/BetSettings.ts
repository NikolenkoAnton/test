import { Column, DataType, Default, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ timestamps: false, tableName: 'bb_bet_settings', freezeTableName: true, underscored: true })
export default class BetSettings extends Model {
  @PrimaryKey
  @Column(new DataType.STRING(8))
  section: string;

  @Default(5.0)
  @Column({ type: new DataType.DECIMAL(7, 2), allowNull: false })
  min_stake_ordinar: number;

  @Default(5.0)
  @Column({ type: new DataType.DECIMAL(7, 2), allowNull: false })
  min_stake_express: number;

  @Default(5.0)
  @Column({ type: new DataType.DECIMAL(7, 2), allowNull: false })
  min_stake_system: number;

  @Default(25000.0)
  @Column({ type: new DataType.DECIMAL(7, 2), allowNull: false })
  max_win_two: number;

  @Default(40000.0)
  @Column({ type: new DataType.DECIMAL(7, 2), allowNull: false })
  max_win_three: number;

  @Default(50000.0)
  @Column({ type: new DataType.DECIMAL(7, 2), allowNull: false })
  max_win_multiple: number;

  @Default(12)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  max_length_express: number;

  @Default(11)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  max_length_system: number;

  @Default(3)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  bet_place_time_delay: number;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
