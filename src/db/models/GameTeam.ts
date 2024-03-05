import {
  AutoIncrement,
  BelongsTo,
  Column,
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
import Team from './Team';

@Table({ timestamps: false, tableName: 'bb_game_team', freezeTableName: true, underscored: true })
export default class GameTeam extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Game)
  @Column({ type: DataType.BIGINT, allowNull: false, unique: 'game_team', references: { model: 'bb_game', key: 'id' } })
  game_id: number;

  @ForeignKey(() => Team)
  @Column({ type: DataType.BIGINT, allowNull: false, unique: 'game_team', references: { model: 'bb_team', key: 'id' } })
  team_id: number;

  @Column(DataType.DATEONLY)
  start_date: Date;

  @Default('undefined')
  @Column(new DataType.STRING(9))
  type: string;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @BelongsTo(() => Game, { targetKey: 'id', foreignKey: 'game_id', as: 'game' })
  getGame: BelongsToGetAssociationMixin<Game>;
  @BelongsTo(() => Team, { targetKey: 'id', foreignKey: 'team_id', as: 'team' })
  getTeam: BelongsToGetAssociationMixin<Team>;
}
