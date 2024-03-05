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
} from 'sequelize-typescript';
import sequelize, { BelongsToGetAssociationMixin } from 'sequelize';
import Game from './Game';

@Table({ timestamps: false, tableName: 'bb_game_event', freezeTableName: true, underscored: true })
export default class GameEvent extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Game)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_game', key: 'id' } })
  game_id: number;

  @Column(DataType.BIGINT)
  game_team_id: number;

  @Column(new DataType.STRING(32))
  type: string;

  @Column(DataType.TEXT)
  value: string;

  @Column(new DataType.STRING(255))
  period: string;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @BelongsTo(() => Game, { targetKey: 'id', foreignKey: 'game_id', as: 'game' })
  getGame: BelongsToGetAssociationMixin<Game>;
}
