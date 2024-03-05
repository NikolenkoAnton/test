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

@Table({ timestamps: true, tableName: 'bb_promotion_mpb', freezeTableName: true, underscored: true })
export default class PromotionMpb extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: new DataType.STRING(255), allowNull: false })
  name: string;

  @Column(new DataType.STRING(255))
  description: string;

  @Column({ type: DataType.DATE, allowNull: false })
  date_from: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  date_to: Date;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  deleted: number;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  paused: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  minimum_odds: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  maximum_stake: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  number_boost: number;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;
}
