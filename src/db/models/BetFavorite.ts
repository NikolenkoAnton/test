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
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin } from 'sequelize';
import User from './User';
import Bet from './Bet';

@Table({ timestamps: false, tableName: 'bb_bet_favorite', freezeTableName: true, underscored: true })
export default class BetFavorite extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'bet_favorite_UNIQUE',
    references: { model: 'bb_user', key: 'id' },
  })
  user_id: number;

  @ForeignKey(() => Bet)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'bet_favorite_UNIQUE',
    references: { model: 'bb_bet', key: 'id' },
  })
  bet_id: number;

  @CreatedAt
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' })
  getUser: BelongsToGetAssociationMixin<User>;
  @BelongsTo(() => Bet, { targetKey: 'id', foreignKey: 'bet_id', as: 'bet' })
  getBet: BelongsToGetAssociationMixin<Bet>;
}
