import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import sequelize, { HasManyGetAssociationsMixin, HasOneGetAssociationMixin } from 'sequelize';
import BetOutcome from './BetOutcome';
import BetSlipOutcome from './BetSlipOutcome';
import BetVipOutcome from './BetVipOutcome';
import MarketGroup from './MarketGroup';
import Game from './Game';
import MarketGroupSs from './MarketGroupSs';

@Table({ timestamps: true, tableName: 'bb_game_outcome', freezeTableName: true, underscored: true })
export default class GameOutcome extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Game)
  @Column(DataType.BIGINT)
  game_id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  outcome_id: number;

  @ForeignKey(() => MarketGroupSs)
  @Column({ type: DataType.BIGINT, allowNull: false })
  game_market_id: number;

  @Column({ type: new DataType.DECIMAL(7, 3), allowNull: false })
  coeff: number;

  @Column(new DataType.DECIMAL(7, 3))
  odds_prematch: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  blocked: number;

  @Column(DataType.SMALLINT)
  market_blocked: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  stop_loss: number;

  @Column(new DataType.STRING(11))
  result: string;

  @Column(new DataType.STRING(11))
  result_custom: string;

  @Column(new DataType.STRING(255))
  value: string;

  @Column(DataType.DATE)
  defined_at: Date;

  @Column(DataType.DATE)
  blocked_changed_at: Date;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @HasOne(() => Game, { sourceKey: 'game_id', foreignKey: 'id', as: 'game' })
  getGame: HasOneGetAssociationMixin<Game>;
  @HasOne(() => MarketGroup, { sourceKey: 'game_market_id', foreignKey: 'id', as: 'marketGroup' })
  getMarketGroup: HasOneGetAssociationMixin<MarketGroup>;
  @HasMany(() => BetOutcome, { sourceKey: 'id', foreignKey: 'game_outcome_id', as: 'betOutcomes' })
  getBetOutcomes: HasManyGetAssociationsMixin<BetOutcome>;
  @HasMany(() => BetSlipOutcome, { sourceKey: 'id', foreignKey: 'game_outcome_id', as: 'betSlipOutcomes' })
  getBetSlipOutcomes: HasManyGetAssociationsMixin<BetSlipOutcome>;
  @HasMany(() => BetVipOutcome, { sourceKey: 'id', foreignKey: 'game_outcome_id', as: 'betVipOutcomes' })
  getBetVipOutcomes: HasManyGetAssociationsMixin<BetVipOutcome>;
}
