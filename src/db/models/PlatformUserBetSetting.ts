import { AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'bb_platform_user_bet_setting', freezeTableName: true, underscored: true })
export default class PlatformUserBetSetting extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({type: new DataType.INTEGER, allowNull: false})
  platform_user_id: number;

  @Column({ type: new DataType.STRING(64), allowNull: false })
  accept_odds_change: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
