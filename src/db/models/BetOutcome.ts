import {
  AfterCreate,
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
import Bet from './Bet';
import Outcome from './Outcome';
import GameOutcome from './GameOutcome';
import Game from './Game';
import OutcomeSs from './OutcomeSs';
import BetOutcomeAttributes from './BetOutcomeAttributes';

@Table({ timestamps: true, tableName: 'bb_bet_outcome', freezeTableName: true, underscored: true })
export default class BetOutcome extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Bet)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'bet_outcome_unique',
    references: { model: 'bb_bet', key: 'id' },
  })
  bet_id: number;

  @ForeignKey(() => GameOutcome)
  @Column({ type: DataType.BIGINT, unique: 'bet_outcome_unique', references: { model: 'bb_game_outcome', key: 'id' } })
  game_outcome_id: number;

  @ForeignKey(() => Game)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_game', key: 'id' } })
  game_id: number;

  @ForeignKey(() => OutcomeSs)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_outcome_ss', key: 'id' } })
  outcome_id: number;

  @Column(new DataType.STRING(255))
  game_outcome_value: string;

  @Column(new DataType.STRING(255))
  game_market_value: string;

  @Column({ type: new DataType.STRING(12), allowNull: false })
  game_market_period: string;

  @Column({ type: new DataType.STRING(8), allowNull: false })
  section: string;

  @Column({ type: new DataType.DECIMAL(7, 3), allowNull: false })
  odds: number;

  @Column(new DataType.DECIMAL(12, 2))
  pool: number;

  @Column(new DataType.DECIMAL(12, 2))
  risk: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(12, 2), allowNull: true })
  profit: number;

  @Column(new DataType.STRING(11))
  result: string;

  @Column(new DataType.STRING(11))
  result_custom: string;

  @Column(DataType.BIGINT())
  defined: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @HasOne(() => BetOutcomeAttributes, { sourceKey: 'id', foreignKey: 'bet_outcome_id', as: 'betOutcomeAttributes' })
  betOutcomeAttributes: BetOutcomeAttributes;

  @HasOne(() => OutcomeSs, { sourceKey: 'outcome_id', foreignKey: 'ss_id', as: 'outcomeSs' })
  outcomeSs: HasOneGetAssociationMixin<OutcomeSs>;

  @BelongsTo(() => Bet, { targetKey: 'id', foreignKey: 'bet_id', as: 'bet' })
  getBet: BelongsToGetAssociationMixin<Bet>;
  @BelongsTo(() => Game, { targetKey: 'id', foreignKey: 'game_id', as: 'game' })
  getGame!: BelongsToGetAssociationMixin<Game>;
  @BelongsTo(() => GameOutcome, { targetKey: 'id', foreignKey: 'game_outcome_id', as: 'gameOutcome' })
  getGameOutcome!: BelongsToGetAssociationMixin<GameOutcome>;
  @BelongsTo(() => Outcome, { targetKey: 'id', foreignKey: 'outcome_id', as: 'outcome' })
  getOutcome!: BelongsToGetAssociationMixin<Outcome>;
}
