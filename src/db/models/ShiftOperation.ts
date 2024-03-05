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
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin } from 'sequelize';
import Shift from './Shift';
import User from './User';
import Currency from './Currency';

@Table({ timestamps: false, tableName: 'bb_shift_operation', freezeTableName: true, underscored: true })
export default class ShiftOperation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_user', key: 'id' } })
  user_id: number;

  @ForeignKey(() => Shift)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_shift', key: 'id' } })
  shift_id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  target_id: number;

  @Column({ type: new DataType.STRING(7), allowNull: false })
  target_type: string;

  @ForeignKey(() => Currency)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_currency', key: 'id' } })
  currency_id: number;

  @Column({ type: new DataType.DECIMAL(12, 6), allowNull: false })
  currency_value: number;

  @Column({ type: new DataType.DECIMAL(12, 2), allowNull: false })
  credits: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @BelongsTo(() => Shift, { targetKey: 'id', foreignKey: 'shift_id', as: 'shift' })
  getShift: BelongsToGetAssociationMixin<Shift>;
  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' })
  getUser: BelongsToGetAssociationMixin<User>;
  @BelongsTo(() => Currency, { targetKey: 'id', foreignKey: 'currency_id', as: 'currency' })
  getCurrency: BelongsToGetAssociationMixin<Currency>;
}
