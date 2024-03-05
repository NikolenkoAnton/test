import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin } from 'sequelize';
import Point from './Point';

@Table({ timestamps: true, tableName: 'bb_point_golden_race', freezeTableName: true, underscored: true })
export default class PointGoldenRace extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Point)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_point', key: 'id' } })
  point_id: number;

  @Default(0.0)
  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  credits: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Point, { targetKey: 'id', foreignKey: 'point_id', as: 'point' })
  getPoint: BelongsToGetAssociationMixin<Point>;
}
