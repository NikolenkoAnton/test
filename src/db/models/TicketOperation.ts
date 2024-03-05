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
import { BelongsToGetAssociationMixin } from 'sequelize';
import Ticket from './Ticket';

@Table({ timestamps: true, tableName: 'bb_ticket_operation', freezeTableName: true, underscored: true })
export default class TicketOperation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: new DataType.STRING(36), allowNull: false })
  uuid: string;

  @ForeignKey(() => Ticket)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_ticket', key: 'id' } })
  ticket_id: number;

  @Column(new DataType.STRING(64))
  platform_transaction_id: string;

  @Column(DataType.TEXT)
  platform_response: string;

  @Column(new DataType.STRING(21))
  status: string;

  @Column({ type: DataType.BIGINT, allowNull: false })
  source_id: number;

  @Column({ type: new DataType.STRING(5), allowNull: false })
  source_type: string;

  @Column({ type: new DataType.DECIMAL(12, 2), allowNull: false })
  credits: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  pending: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  pending_counter: number;

  @Column({ type: new DataType.STRING(64), allowNull: false })
  type: string;

  @Column(new DataType.STRING(256))
  data: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Ticket, { targetKey: 'id', foreignKey: 'ticket_id', as: 'ticket' })
  getTicket: BelongsToGetAssociationMixin<Ticket>;
}
