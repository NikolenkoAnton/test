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
import BetSlip from './BetSlip';
import GameOutcome from './GameOutcome';

@Table({ timestamps: true, tableName: 'bb_bet_slip_outcome', freezeTableName: true, underscored: true })
export default class BetSlipOutcome extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => BetSlip)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'unique_bet_slip',
    references: { model: 'bb_bet', key: 'id' },
  })
  bet_slip_id: number;

  @ForeignKey(() => GameOutcome)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'unique_bet_slip',
    references: { model: 'bb_game_outcome', key: 'id' },
  })
  game_outcome_id: number;

  @Column(new DataType.STRING(255))
  game_outcome_value: string;

  @Column({ type: new DataType.DECIMAL(7, 3), allowNull: false })
  odds: number;

  @Column(new DataType.DECIMAL(12, 2))
  stake: number;

  @Column(DataType.SMALLINT)
  freebet: number;

  @Column({ type: DataType.SMALLINT, allowNull: false })
  blocked: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => BetSlip, { targetKey: 'id', foreignKey: 'bet_slip_id', as: 'betSlip' })
  getBetSlip: BelongsToGetAssociationMixin<BetSlip>;
  @BelongsTo(() => GameOutcome, { targetKey: 'id', foreignKey: 'game_outcome_id', as: 'gameOutcome' })
  getGameOutcome: BelongsToGetAssociationMixin<GameOutcome>;
}
