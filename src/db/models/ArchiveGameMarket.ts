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

@Table({ timestamps: true, tableName: 'bb_archive_game_market', freezeTableName: true, underscored: true })
export default class ArchiveGameMarket extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  game_id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  market_group_id: number;

  @Column(DataType.BIGINT)
  template_market_group_id: number;

  @Column(new DataType.STRING(8))
  period: string;

  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  enabled: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  suspended: number;

  @Column(new DataType.STRING(8))
  value: string;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  dynamic: number;

  @Column(DataType.BIGINT)
  max_win: number;

  @Column(DataType.BIGINT)
  stop_loss: number;

  @Column(DataType.SMALLINT)
  margin: number;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;
}
