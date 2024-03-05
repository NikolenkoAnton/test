import { Column, CreatedAt, DataType, Default, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import sequelize from 'sequelize';

@Table({ timestamps: true, tableName: 'bb_archive_game', freezeTableName: true, underscored: true })
export default class ArchiveGame extends Model {
  @PrimaryKey
  @Default(0)
  @Column(DataType.BIGINT)
  id: number;

  @Column(new DataType.STRING(5))
  code: string;

  @Column({ type: DataType.BIGINT, allowNull: false })
  competition_id: number;

  @Column(DataType.BIGINT)
  template_time_id: number;

  @Column(DataType.JSON)
  rules: any;

  @Default(new Date(0))
  @Column({ type: DataType.DATEONLY, allowNull: false })
  start_date: Date;

  @Column({ type: DataType.TIME, allowNull: false })
  start_time: string;

  @Column(DataType.DATE)
  start: Date;

  @Column({ type: new DataType.STRING(8), allowNull: false })
  status: string;

  @Column(new DataType.STRING(8))
  status_custom: string;

  @Column(new DataType.STRING(255))
  name: string;

  @Column(DataType.SMALLINT)
  super_top: number;

  @Column(DataType.INTEGER)
  current_time: number;

  @Column(new DataType.STRING(255))
  period: string;

  @Column(DataType.JSON)
  score: any;

  @Column(new DataType.STRING(512))
  video: string;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  blocked: number;

  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  enabled: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  suspended: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  allowed: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  error_ignore: number;

  @Default(0)
  @Column(DataType.TEXT)
  comment: string;

  @Column(DataType.BIGINT)
  max_win: number;

  @Column(DataType.BIGINT)
  stop_loss: number;

  @Column(DataType.SMALLINT)
  margin: number;

  @Column(DataType.SMALLINT)
  max_bets: number;

  @Column(DataType.SMALLINT)
  min_feeds: number;

  @Column(DataType.DATE)
  calculate_at: Date;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  ordinar_only: number;

  @Column(DataType.BIGINT)
  external_id: number;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;
}
