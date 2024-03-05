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
import Game from './Game';
import User from './User';

@Table({ timestamps: true, tableName: 'bb_game_favorite', freezeTableName: true, underscored: true })
export default class GameFavorite extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'game_favorite_user_id_game_id_unique',
    references: { model: 'bb_user', key: 'id' },
  })
  user_id: number;

  @ForeignKey(() => Game)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'game_favorite_user_id_game_id_unique',
    references: { model: 'bb_game', key: 'id' },
  })
  game_id: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Game, { targetKey: 'id', foreignKey: 'game_id', as: 'game' })
  getGame: BelongsToGetAssociationMixin<Game>;
  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' })
  getUser: BelongsToGetAssociationMixin<User>;
}
