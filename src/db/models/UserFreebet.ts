import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import sequelize from 'sequelize';

@Table({ timestamps: true, tableName: 'bb_user_freebet', freezeTableName: true, underscored: true })
export default class UserFreebet extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false, unique: 'platform_freebet_id' })
  platform_freebet_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  promotion_freebet_id: number;

  @Column({ type: DataType.REAL, allowNull: false })
  amount: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  active: number;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  expired_at: Date;
}
