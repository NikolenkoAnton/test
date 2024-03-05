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
import Ticket from './Ticket';

@Table({ timestamps: true, tableName: 'bb_ticket_externals', freezeTableName: true, underscored: true })
export default class TicketExternals extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, references: { model: 'bb_user', key: 'id' } })
  user_id: number;

  @ForeignKey(() => Ticket)
  @Column({ type: DataType.INTEGER, allowNull: false, references: { model: 'bb_ticket', key: 'id' } })
  ticket_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  external_id: number;

  @Column({ type: DataType.SMALLINT, allowNull: false })
  type: number;

  @Column(DataType.TEXT)
  request: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' })
  getUser: BelongsToGetAssociationMixin<User>;
  @BelongsTo(() => Ticket, { targetKey: 'id', foreignKey: 'ticket_id', as: 'ticket' })
  getTicket: BelongsToGetAssociationMixin<Ticket>;
}
