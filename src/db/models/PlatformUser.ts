import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import Payment from './Payment';
import Platform from './Platform';
import User from './User';
import Bet from './Bet';

@Table({ timestamps: true, tableName: 'bb_platform_user', freezeTableName: true, underscored: true })
export default class PlatformUser extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => Platform)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_platform', key: 'id' } })
  platform_id: number;

  // @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, unique: 'user_id_UNIQUE' }) //, references: {model: 'bb_user', key: 'id'}})
  user_id: number;

  @Column(DataType.JSON)
  data: any;

  @Column(DataType.DATE)
  synchronized_at: Date;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Platform, { targetKey: 'id', foreignKey: 'platform_id', as: 'platform' })
  getPlatform: BelongsToGetAssociationMixin<Platform>;
  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' })
  getUser: BelongsToGetAssociationMixin<User>;

  @HasMany(() => Bet, { sourceKey: 'id', foreignKey: 'user_id', as: 'bets' })
  getBets: HasManyGetAssociationsMixin<Bet>;

  @HasMany(() => Payment, { sourceKey: 'id', foreignKey: 'platform_user_id', as: 'payments' })
  getPayments: HasManyGetAssociationsMixin<Payment>;
}
