import { AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ timestamps: false, tableName: 'bb_archive_shift_operation', freezeTableName: true, underscored: true })
export default class ArchiveShiftOperation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.BIGINT)
  user_id: number;

  @Column(DataType.BIGINT)
  shift_id: number;

  @Column(DataType.BIGINT)
  ticket_id: number;

  @Column(new DataType.DECIMAL(12, 2))
  credits: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;
}
