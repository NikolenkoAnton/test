import { AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'bb_archive_ticket_operation', freezeTableName: true, underscored: true })
export default class ArchiveTicketOperation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(new DataType.STRING(36))
  uuid: string;

  @Column(DataType.BIGINT)
  ticket_id: number;

  @Column(DataType.BIGINT)
  source_id: number;

  @Column(new DataType.STRING(5))
  source_type: string;

  @Column(new DataType.DECIMAL(12, 2))
  credits: number;

  @Column(DataType.SMALLINT)
  pending: number;

  @Column(DataType.SMALLINT)
  pending_counter: number;

  @Column(new DataType.STRING(64))
  type: string;

  @Column(new DataType.STRING(256))
  data: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
