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
import Competition from './Competition';

@Table({ timestamps: true, tableName: 'bb_competition_stat', freezeTableName: true, underscored: true })
export default class CompetitionStat extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Competition)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'competition_stat_competition_UNIQUE',
    references: { model: 'bb_competition', key: 'id' },
  })
  competition_id: string;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  pool: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  profit: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  margin: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  quantity: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  pool_prematch_single: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  pool_prematch_multiple: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  pool_live_single: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  pool_live_multiple: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  profit_prematch_single: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  profit_prematch_multiple: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  profit_live_single: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  profit_live_multiple: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  quantity_prematch_single: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  quantity_prematch_multiple: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  quantity_live_single: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  quantity_live_multiple: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Competition, { targetKey: 'id', foreignKey: 'competition_id', as: 'competition' })
  getCompetition: BelongsToGetAssociationMixin<Competition>;
}
