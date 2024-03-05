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
import User from './User';
import Agent from './Agent';
import Currency from './Currency';

@Table({ timestamps: false, tableName: 'bb_transaction', freezeTableName: true, underscored: true })
export default class Transaction extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_user', key: 'id' } })
  user_id: number;

  @ForeignKey(() => Agent)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_agent', key: 'id' } })
  agent_id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  item_id: number;

  @Column({ type: new DataType.STRING(17), allowNull: false })
  item_type: string;

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

  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' })
  getUser: BelongsToGetAssociationMixin<User>;
  @BelongsTo(() => Agent, { targetKey: 'id', foreignKey: 'agent_id', as: 'agent' })
  getAgent: BelongsToGetAssociationMixin<Agent>;
  @BelongsTo(() => Currency, { targetKey: 'id', foreignKey: 'currency_id', as: 'currency' })
  getCurrency: BelongsToGetAssociationMixin<Currency>;
}
