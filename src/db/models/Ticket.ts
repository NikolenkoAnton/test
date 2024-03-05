import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import Bet from './Bet';
import TicketExternals from './TicketExternals';
import TicketOperation from './TicketOperation';
import User from './User';

@Table({ timestamps: true, tableName: 'bb_ticket', freezeTableName: true, underscored: true })
export default class Ticket extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_user', key: 'id' } })
  user_id: number;

  @Column(DataType.BIGINT)
  point_id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  currency_id: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(12, 2), allowNull: false })
  credits: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  disposable: number;

  @Column({ type: new DataType.CHAR(12), unique: 'code' })
  code: string;

  @Column(new DataType.STRING(256))
  comment_cashier: string;

  @Column(new DataType.STRING(256))
  comment: string;

  @Default(100)
  @Column({ type: DataType.INTEGER, allowNull: false })
  max_win_single_modifier: number;

  @Default(100)
  @Column({ type: DataType.INTEGER, allowNull: false })
  max_bets_modifier: number;

  @Default(100)
  @Column({ type: DataType.INTEGER, allowNull: false })
  max_win_multiple_modifier: number;

  @Default(100)
  @Column({ type: DataType.INTEGER, allowNull: false })
  bet_place_time_delay_modifier: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @Column(DataType.DATE)
  deleted_at: Date;

  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' })
  getUser: BelongsToGetAssociationMixin<User>;

  @HasMany(() => TicketExternals, { sourceKey: 'id', foreignKey: 'ticket_id', as: 'ticketExternals' })
  getTicketExternals: HasManyGetAssociationsMixin<TicketExternals>;
  @HasMany(() => TicketOperation, { sourceKey: 'id', foreignKey: 'ticket_id', as: 'ticketOperations' })
  getTicketOperations: HasManyGetAssociationsMixin<TicketOperation>;
  @HasMany(() => Bet, { sourceKey: 'id', foreignKey: 'ticket_id', as: 'bets' })
  getBets: HasManyGetAssociationsMixin<Bet>;
}
