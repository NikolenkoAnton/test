import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import BetOutcome from './BetOutcome';

@Table({ timestamps: false, tableName: 'bb_bet_outcome_attributes', freezeTableName: true, underscored: true })
export default class BetOutcomeAttributes extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.TEXT)
  sport_external_id: string;

  @Column(DataType.TEXT)
  category_external_id: string;

  @Column(DataType.TEXT)
  competition_external_id: string;

  @Column(DataType.INTEGER)
  sport_id: string;

  @Column(DataType.INTEGER)
  category_id: string;

  @Column(DataType.INTEGER)
  competition_id: string;

  @Column(DataType.TEXT)
  game_external_id: string;

  @ForeignKey(() => BetOutcome)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: 'bb_bet_outcome', key: 'id' },
  })
  bet_outcome_id: number;

  @Column(DataType.INTEGER)
  game_market_id: number; // outcomeSs.ss_market_id

  @Column(DataType.INTEGER)
  home_team_id?: number;

  @Column(DataType.INTEGER)
  away_team_id?: number;

  @Column(DataType.TEXT)
  home_team_name?: string;

  @Column(DataType.TEXT)
  away_team_name?: string;

  @Column(DataType.TEXT)
  outcome_name?: string;

  @Column(DataType.TEXT)
  sport_name: string; // game.competition.sport.en

  @Column(DataType.TEXT)
  category_name: string; // game.competition.category.en

  @Column(DataType.TEXT)
  competition_name: string; //game.competition.en

  @Column(DataType.TEXT)
  game_status: string; // GAME_STATUSES[betOutcome.game.status_custom || betOutcome.game.status]

  @Column(DataType.TEXT)
  game_name: string; // game.name

  @Column(DataType.TEXT)
  market_name: string; // outcomeSs.marketGroupSs.name

  @Column(DataType.INTEGER)
  market_id: number; // outcomeSs.marketGroupSs.id

  @Column(DataType.DATE)
  event_start: Date; // outcomeSs.marketGroupSs.id
}
