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
import Game from './Game';

@Table({ timestamps: true, tableName: 'bb_game_time_event', freezeTableName: true, underscored: true })
export default class GameTimeEvent extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Game)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'game_time_event_game_id_sort_unique',
    references: { model: 'bb_game', key: 'id' },
  })
  game_id: number;

  @Column(DataType.BIGINT)
  game_team_id: number;

  @Column({ type: new DataType.DECIMAL(8, 2), unique: 'game_time_event_game_id_sort_unique' })
  sort: number;

  @Column(new DataType.STRING(13))
  type: string;

  @Column(new DataType.STRING(32))
  period: string;

  @Column(DataType.SMALLINT)
  value: number;

  @Column(DataType.INTEGER)
  time: number;

  @Column(DataType.DATE)
  deleted_at: Date;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Game, { targetKey: 'id', foreignKey: 'game_id', as: 'game' })
  getGame: BelongsToGetAssociationMixin<Game>;
}
