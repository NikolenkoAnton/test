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

@Table({ timestamps: true, tableName: 'bb_archive_game_outcome', freezeTableName: true, underscored: true })
export default class ArchiveGameOutcome extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.BIGINT)
  game_id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  outcome_id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  game_market_id: number;

  @Column(new DataType.DECIMAL(7, 3))
  coeff: number;

  @Column(new DataType.DECIMAL(7, 3))
  odds_prematch: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  blocked: number;

  @Column(DataType.SMALLINT)
  market_blocked: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  stop_loss: number;

  @Column(new DataType.STRING(11))
  result: string;

  @Column(new DataType.STRING(11))
  result_custom: string;

  @Column(new DataType.STRING(255))
  value: string;

  @Column(DataType.DATE)
  defined_at: Date;

  @Column(DataType.DATE)
  blocked_changed_at: Date;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;
}
