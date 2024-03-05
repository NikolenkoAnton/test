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
import User from './User';
import Currency from './Currency';
import Point from './Point';
import PlatformUser from './PlatformUser';

@Table({ timestamps: true, tableName: 'bb_payment', freezeTableName: true, underscored: true })
export default class Payment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: new DataType.STRING(36), unique: 'uuid_UNIQUE' })
  uuid: string;

  @Column(new DataType.STRING(10))
  type: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_user', key: 'id' } })
  user_id: number;

  @ForeignKey(() => Point)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_point', key: 'id' } })
  point_id: number;

  @ForeignKey(() => Currency)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_currency', key: 'id' } })
  currency_id: number;

  @Column(new DataType.DECIMAL(12, 6))
  currency_value: number;

  @ForeignKey(() => PlatformUser)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_platform_user', key: 'id' } })
  platform_user_id: number;

  @Column({ type: new DataType.STRING(256), unique: 'platform_transaction_id_UNIQUE' })
  platform_transaction_id: string;

  @Column({ type: new DataType.DECIMAL(12, 2), allowNull: false })
  amount: number;

  @Column(new DataType.STRING(10))
  status: string;

  @Column(new DataType.STRING(256))
  callback_url: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' })
  getUser: BelongsToGetAssociationMixin<User>;
  @BelongsTo(() => Point, { targetKey: 'id', foreignKey: 'point_id', as: 'point' })
  getPoint: BelongsToGetAssociationMixin<Point>;
  @BelongsTo(() => Currency, { targetKey: 'id', foreignKey: 'currency_id', as: 'currency' })
  getCurrency: BelongsToGetAssociationMixin<Currency>;
  @BelongsTo(() => PlatformUser, { targetKey: 'id', foreignKey: 'platform_user_id', as: 'platformUser' })
  getPlatformUser: BelongsToGetAssociationMixin<PlatformUser>;
}
