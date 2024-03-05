import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin } from 'sequelize';
import Point from './Point';

@Table({ timestamps: true, tableName: 'bb_terminal', freezeTableName: true, underscored: true })
export default class Terminal extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(new DataType.STRING(128))
  session_id: string;

  @ForeignKey(() => Point)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_point', key: 'id' } })
  point_id: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Point, { targetKey: 'id', foreignKey: 'point_id', as: 'point' })
  getPoint: BelongsToGetAssociationMixin<Point>;
}
