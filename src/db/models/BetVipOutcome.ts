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
import BetVip from './BetVip';
import GameOutcome from './GameOutcome';

@Table({ timestamps: true, tableName: 'bb_bet_vip_outcome', freezeTableName: true, underscored: true })
export default class BetVipOutcome extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => BetVip)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_bet_vip', key: 'id' } })
  bet_vip_id: number;

  @ForeignKey(() => GameOutcome)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_game_outcome', key: 'id' } })
  game_outcome_id: number;

  @Column(new DataType.STRING(8))
  game_outcome_value: string;

  @Column(new DataType.DECIMAL(12, 2))
  stake: number;

  @Column({ type: new DataType.DECIMAL(7, 3), allowNull: false })
  odds: number;

  @Column({ type: new DataType.DECIMAL(7, 3), allowNull: false })
  odds_original: number;

  @Column({ type: DataType.SMALLINT, allowNull: false })
  blocked: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => BetVip, { targetKey: 'id', foreignKey: 'bet_vip_id', as: 'betVip' })
  getBetVip: BelongsToGetAssociationMixin<BetVip>;
  @BelongsTo(() => GameOutcome, { targetKey: 'id', foreignKey: 'game_outcome_id', as: 'gameOutcome' })
  getGameOutcome: BelongsToGetAssociationMixin<GameOutcome>;
}
