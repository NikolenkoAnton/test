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
  BelongsTo,
  ForeignKey,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import sequelize, { BelongsToGetAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import Point from './Point';
import Transaction from './Transaction';
import Platform from './Platform';

@Table({ timestamps: true, tableName: 'bb_agent', freezeTableName: true, underscored: true })
export default class Agent extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Agent)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_agent', key: 'id' } })
  agent_id: number;

  // @ForeignKey(() => Platform)
  @Column({ type: DataType.BIGINT })
  platform_id: number;

  @Default('0')
  @Column({ type: new DataType.STRING(64), allowNull: false, unique: 'name' })
  name: string;

  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  payments_allowed: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(12, 2), allowNull: false })
  credits: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  closed: number;

  @Column(DataType.TEXT)
  bill_ticket: string;

  @Column(DataType.TEXT)
  bill_bet_slip: string;

  @Column(DataType.TEXT)
  bill_deposit: string;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Platform, { targetKey: 'id', foreignKey: 'platform_id', as: 'platform' })
  getPlatform: BelongsToGetAssociationMixin<Platform>;
  @BelongsTo(() => Agent, { targetKey: 'id', foreignKey: 'agent_id', as: 'agent' })
  getAgent: BelongsToGetAssociationMixin<Agent>;

  @HasMany(() => Agent, { sourceKey: 'id', foreignKey: 'agent_id', as: 'agents' })
  getAgents: HasManyGetAssociationsMixin<Agent>;
  @HasMany(() => Point, { sourceKey: 'id', foreignKey: 'agent_id', as: 'points' })
  getPoints: HasManyGetAssociationsMixin<Point>;
  @HasMany(() => Transaction, { sourceKey: 'id', foreignKey: 'agent_id', as: 'transactions' })
  getTransactions: HasManyGetAssociationsMixin<Transaction>;
}
