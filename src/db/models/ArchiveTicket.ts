import { AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import sequelize from 'sequelize';

@Table({ timestamps: true, tableName: 'bb_archive_ticket', freezeTableName: true, underscored: true })
export default class ArchiveTicket extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.BIGINT)
  user_id: number;

  @Column(DataType.BIGINT)
  point_id: number;

  @Column(DataType.BIGINT)
  currency_id: number;

  @Column(new DataType.DECIMAL(12, 2))
  credits: number;

  @Column(DataType.SMALLINT)
  disposable: number;

  @Column(new DataType.STRING(12))
  code: string;

  @Column(new DataType.STRING(256))
  comment_cashier: string;

  @Column(new DataType.STRING(256))
  comment: string;

  @Column(DataType.SMALLINT)
  max_win_single_modifier: string;

  @Column(DataType.SMALLINT)
  max_bets_modifier: string;

  @Column(DataType.SMALLINT)
  max_win_multiple_modifier: string;

  @Column(DataType.SMALLINT)
  bet_place_time_delay_modifier: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
