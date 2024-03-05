import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { BelongsToGetAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import BetSlip from './BetSlip';
import User from './User';

@Table({ timestamps: false, tableName: 'bb_session', freezeTableName: true, underscored: true })
export default class Session extends Model {
  @PrimaryKey
  @Column({ type: new DataType.STRING(128), allowNull: false })
  id: number;

  @Column(new DataType.STRING(64))
  socket_id: string;

  @Column(new DataType.STRING(16))
  app_version: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_user', key: 'id' } })
  user_id: number;

  @Column(DataType.INTEGER)
  last_activity: number;

  @Column(new DataType.STRING(64))
  ip_address: string;

  @Column(DataType.TEXT)
  user_agent: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  payload: string;

  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' })
  getUser: BelongsToGetAssociationMixin<User>;

  @HasMany(() => BetSlip, { sourceKey: 'id', foreignKey: 'session_id', as: 'betSlips' })
  getBetSlips: HasManyGetAssociationsMixin<BetSlip>;
}
