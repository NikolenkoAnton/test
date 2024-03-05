import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import sequelize, { BelongsToGetAssociationMixin } from 'sequelize';
import Provider from './Provider';
import Game from './Game';

@Table({ timestamps: true, tableName: 'bb_provider_odds', freezeTableName: true, underscored: true })
export default class ProviderOdds extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Game)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_game', key: 'id' } })
  game_id: number;

  @ForeignKey(() => Provider)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_provider', key: 'id' } })
  provider_id: number;

  @Column({ type: new DataType.STRING(8), allowNull: false })
  market_type: string;

  @Column({ type: new DataType.DECIMAL(4, 1), allowNull: false })
  market_value: number;

  @Column({ type: new DataType.STRING(8), allowNull: false })
  period: string;

  @Column(DataType.BIGINT)
  score_current_home: number;

  @Column(DataType.BIGINT)
  score_current_away: number;

  @Column(DataType.BIGINT)
  score_final_home: number;

  @Column(DataType.BIGINT)
  score_final_away: number;

  @Column(DataType.BIGINT)
  score_final_t1_home: number;

  @Column(DataType.BIGINT)
  score_final_t1_away: number;

  @Column(DataType.BIGINT)
  score_period_home: number;

  @Column(DataType.BIGINT)
  score_period_away: number;

  @Column({ type: DataType.SMALLINT, allowNull: false })
  current_minute: number;

  @Column({ type: new DataType.DECIMAL(6, 3), allowNull: false })
  odd_home: number;

  @Column({ type: new DataType.DECIMAL(6, 3), allowNull: false })
  odd_away: number;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @BelongsTo(() => Provider, { targetKey: 'id', foreignKey: 'provider_id', as: 'provider' })
  getProvider: BelongsToGetAssociationMixin<Provider>;
  @BelongsTo(() => Game, { targetKey: 'id', foreignKey: 'game_id', as: 'game' })
  getGame: BelongsToGetAssociationMixin<Game>;
}
