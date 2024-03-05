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
import BetVip from './BetVip';
import Payment from './Payment';
import Platform from './Platform';
import PointGoldenRace from './PointGoldenRace';
import Shift from './Shift';
import Terminal from './Terminal';
import Agent from './Agent';

@Table({ timestamps: true, tableName: 'bb_point', freezeTableName: true, underscored: true })
export default class Point extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Agent)
  @Column({ type: DataType.BIGINT, allowNull: false, unique: 'unique', references: { model: 'bb_agent', key: 'id' } })
  agent_id: number;

  @Column({ type: new DataType.STRING(64), allowNull: false, unique: 'unique' })
  name: string;

  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  payments_allowed: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  payments_enabled: number;

  @Column(new DataType.STRING(64))
  city: string;

  @Column(new DataType.STRING(128))
  address: string;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(16, 6), allowNull: false })
  credits: number;

  @Column(new DataType.STRING(256))
  emails: string;

  @Column(new DataType.DECIMAL(5, 2))
  min_bet: number;

  @Column(new DataType.DECIMAL(5, 2))
  max_bet: number;

  @Column(new DataType.STRING(45))
  ip: string;

  @Column(DataType.TEXT)
  bill_ticket: string;

  @Column(DataType.TEXT)
  bill_bet_slip: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Agent, { targetKey: 'id', foreignKey: 'agent_id', as: 'agent' })
  getAgent: BelongsToGetAssociationMixin<Agent>;

  @HasMany(() => BetVip, { sourceKey: 'id', foreignKey: 'point_id', as: 'betVips' })
  getBetVips: HasManyGetAssociationsMixin<BetVip>;
  @HasMany(() => Payment, { sourceKey: 'id', foreignKey: 'point_id', as: 'payments' })
  getPayments: HasManyGetAssociationsMixin<Payment>;
  @HasMany(() => Platform, { sourceKey: 'id', foreignKey: 'point_id', as: 'platforms' })
  getPlatforms: HasManyGetAssociationsMixin<Platform>;
  @HasMany(() => PointGoldenRace, { sourceKey: 'id', foreignKey: 'point_id', as: 'pointGoldenRaces' })
  getPointGoldenRaces: HasManyGetAssociationsMixin<PointGoldenRace>;
  @HasMany(() => Shift, { sourceKey: 'id', foreignKey: 'point_id', as: 'shifts' })
  getShifts: HasManyGetAssociationsMixin<Shift>;
  @HasMany(() => Terminal, { sourceKey: 'id', foreignKey: 'point_id', as: 'terminals' })
  getTerminals: HasManyGetAssociationsMixin<Terminal>;
}
