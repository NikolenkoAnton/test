import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin, HasOneGetAssociationMixin } from 'sequelize';
import BetVipOutcome from './BetVipOutcome';
import Point from './Point';

@Table({ timestamps: true, tableName: 'bb_bet_vip', freezeTableName: true, underscored: true })
export default class BetVip extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Point)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_point', key: 'id' } })
  point_id: number;

  @Column(DataType.BIGINT)
  bet_slip_id: number;

  @Column({ type: new DataType.STRING(32), allowNull: false })
  status: string;

  @Column({ type: new DataType.STRING(32), allowNull: false })
  type: string;

  @Column(new DataType.DECIMAL(12, 2))
  stake: number;

  @Column(new DataType.DECIMAL(12, 2))
  possible_stake: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(12, 3), allowNull: false })
  odds: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(12, 2), allowNull: false })
  possible_win: number;

  @Default(0.0)
  @Column(DataType.INTEGER)
  system: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Point, { targetKey: 'id', foreignKey: 'point_id', as: 'point' })
  getPoint: BelongsToGetAssociationMixin<Point>;

  @HasOne(() => BetVipOutcome, { sourceKey: 'id', foreignKey: 'bet_vip_id', as: 'betVipOutcome' })
  getBetVipOutcome: HasOneGetAssociationMixin<BetVipOutcome>;
}
