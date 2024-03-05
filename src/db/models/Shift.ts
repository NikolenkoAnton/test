import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import ShiftOperation from './ShiftOperation';
import Point from './Point';

@Table({ timestamps: true, tableName: 'bb_shift', freezeTableName: true, underscored: true })
export default class Shift extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Point)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_point', key: 'id' } })
  point_id: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(12, 2), allowNull: false })
  deposit: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(12, 2), allowNull: false })
  withdraw: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Point, { targetKey: 'id', foreignKey: 'point_id', as: 'point' })
  getPoint: BelongsToGetAssociationMixin<Point>;

  @HasMany(() => ShiftOperation, { sourceKey: 'id', foreignKey: 'shift_id', as: 'shiftOperations' })
  getShiftOperations: HasManyGetAssociationsMixin<ShiftOperation>;
}
