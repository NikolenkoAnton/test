import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
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
import sequelize, {
  BelongsToGetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasOneGetAssociationMixin,
} from 'sequelize';
import BetOutcome from './BetOutcome';
import TemplateTime from './TemplateTime';
import GameEvent from './GameEvent';
import GameTeam from './GameTeam';
import GameTimeEvent from './GameTimeEvent';
import ProviderInfo from './ProviderInfo';
import ProviderOdds from './ProviderOdds';
import GameFavorite from './GameFavorite';
import Competition from './Competition';
import Team from './Team';

@Table({ timestamps: true, tableName: 'bb_game', freezeTableName: true, underscored: true })
export default class Game extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(new DataType.STRING(5))
  code: string;

  @ForeignKey(() => Competition)
  @Column({ type: DataType.BIGINT, allowNull: false })
  competition_id: number;

  @ForeignKey(() => TemplateTime)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_template_time', key: 'id' } })
  template_time_id: number;

  @Column(DataType.JSON)
  rules: any;

  @Default(new Date('2020-01-01'))
  @Column({ type: DataType.DATEONLY, allowNull: false })
  start_date: Date;

  @Column(DataType.TIME)
  start_time: string;

  @Column(DataType.DATE)
  start: Date;

  @Column(new DataType.STRING(8))
  status: string;

  @Column(new DataType.STRING(8))
  status_custom: string;

  @Column(new DataType.STRING(255))
  name: string;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  super_top: number;

  @Column(DataType.INTEGER)
  current_time: number;

  @Column(new DataType.STRING(255))
  period: string;

  @Column(DataType.JSON)
  score: any;

  @Column(new DataType.STRING(512))
  video: string;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  blocked: number;

  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  enabled: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  suspended: number;

  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  allowed: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  error_ignore: number;

  @Column(DataType.TEXT)
  comment: string;

  @Column(DataType.BIGINT)
  max_win: number;

  @Column(DataType.BIGINT)
  stop_loss: number;

  @Column(DataType.SMALLINT)
  margin: number;

  @Column(DataType.SMALLINT)
  max_bets: number;

  @Column(DataType.SMALLINT)
  min_feeds: number;

  @Column(DataType.DATE)
  calculate_at: Date;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  ordinar_only: number;

  @Column(new DataType.STRING(64))
  external_id: string;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @BelongsToMany(() => Team, () => GameTeam)
  teams: Team[];

  @BelongsTo(() => TemplateTime, { targetKey: 'id', foreignKey: 'template_time_id', as: 'templateTime' })
  getTemplateTime: BelongsToGetAssociationMixin<TemplateTime>;

  @HasOne(() => Competition, { sourceKey: 'competition_id', foreignKey: 'id', as: 'competition' })
  getCompetition: HasOneGetAssociationMixin<Competition>;
  @HasMany(() => BetOutcome, { sourceKey: 'id', foreignKey: 'game_id', as: 'betOutcomes' })
  getBetOutcomes: HasManyGetAssociationsMixin<BetOutcome>;
  @HasMany(() => GameEvent, { sourceKey: 'id', foreignKey: 'game_id', as: 'gameEvents' })
  getGameEvents: HasManyGetAssociationsMixin<GameEvent>;
  @HasMany(() => GameFavorite, { sourceKey: 'id', foreignKey: 'game_id', as: 'gameFavorites' })
  getGameFavorites: HasManyGetAssociationsMixin<GameFavorite>;
  @HasMany(() => GameTeam, { sourceKey: 'id', foreignKey: 'game_id', as: 'homeTeams' })
  getHomeTeams: HasManyGetAssociationsMixin<GameTeam>;
  @HasMany(() => GameTeam, { sourceKey: 'id', foreignKey: 'game_id', as: 'awayTeams' })
  getAwayTeams: HasManyGetAssociationsMixin<GameTeam>;
  @HasMany(() => GameTeam, { sourceKey: 'id', foreignKey: 'game_id', as: 'gameTeams' })
  getGameTeams: HasManyGetAssociationsMixin<GameTeam>;
  @HasMany(() => GameTimeEvent, { sourceKey: 'id', foreignKey: 'game_id', as: 'gameTimeEvents' })
  getGameTimeEvents: HasManyGetAssociationsMixin<GameTimeEvent>;
  @HasMany(() => ProviderInfo, { sourceKey: 'id', foreignKey: 'game_id', as: 'providerInfos' })
  getProviderInfos: HasManyGetAssociationsMixin<ProviderInfo>;
  @HasMany(() => ProviderOdds, { sourceKey: 'id', foreignKey: 'game_id', as: 'providerOdds' })
  getProviderOdds: HasManyGetAssociationsMixin<ProviderOdds>;
}
