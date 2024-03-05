import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin } from 'sequelize';
import User from './User';

@Table({ timestamps: false, tableName: 'bb_user_favorite', freezeTableName: true, underscored: true })
export default class UserFavorite extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'user_favorite_UNIQUE',
    references: { model: 'bb_user', key: 'id' },
  })
  user_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'user_favorite_UNIQUE',
    references: { model: 'bb_user', key: 'id' },
  })
  player_id: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' })
  getUser: BelongsToGetAssociationMixin<User>;
  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'player_id', as: 'player' })
  getPlayer: BelongsToGetAssociationMixin<User>;
}
