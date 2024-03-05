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
import User from './User';
import Bet from './Bet';

@Table({ timestamps: true, tableName: 'bb_bet_cancelation', freezeTableName: true, underscored: true })
export default class BetCancelation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Bet)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'bet_cancelation_bet_id_user_id_reason_unique',
    references: { model: 'bb_bet', key: 'id' },
  })
  bet_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'bet_cancelation_bet_id_user_id_reason_unique',
    references: { model: 'bb_user', key: 'id' },
  })
  user_id: number;

  @Column({ type: new DataType.STRING(512), allowNull: false, unique: 'bet_cancelation_bet_id_user_id_reason_unique' })
  reason: string;

  @Column(new DataType.STRING(512))
  fail: string;

  @Column({ type: DataType.SMALLINT, allowNull: false })
  canceled: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' })
  getUser: BelongsToGetAssociationMixin<User>;
  @BelongsTo(() => Bet, { targetKey: 'id', foreignKey: 'bet_id', as: 'bet' })
  getBet: BelongsToGetAssociationMixin<Bet>;
}
