import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import sequelize from 'sequelize';

@Table({ timestamps: true, tableName: 'bb_archive_game_time_event', freezeTableName: true, underscored: true })
export default class ArchiveGameTimeEvent extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  game_id: number;

  @Column(DataType.BIGINT)
  game_team_id: number;

  @Column(new DataType.DECIMAL(6, 2))
  sort: number;

  @Column(new DataType.STRING(13))
  type: string;

  @Column({ type: new DataType.STRING(255), allowNull: false })
  period: string;

  @Column(DataType.SMALLINT)
  value: number;

  @Column(DataType.INTEGER)
  time: number;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  updated_at: Date;

  @Column(DataType.DATE)
  deleted_at: Date;
}
