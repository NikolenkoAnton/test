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
import sequelize, { BelongsToGetAssociationMixin } from 'sequelize';
import Platform from './Platform';
import Competition from './Competition';

@Table({ timestamps: true, tableName: 'bb_platform_competition', freezeTableName: true, underscored: true })
export default class PlatformCompetition extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Platform)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'platform_competition_UNIQUE',
    references: { model: 'bb_platform', key: 'id' },
  })
  platform_id: number;

  @ForeignKey(() => Competition)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'platform_competition_UNIQUE',
    references: { model: 'bb_competition', key: 'id' },
  })
  competition_id: number;

  @Default(100)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  sort: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  top: number;

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

  @BelongsTo(() => Platform, { targetKey: 'id', foreignKey: 'platform_id', as: 'platform' })
  getPlatform: BelongsToGetAssociationMixin<Platform>;
  @BelongsTo(() => Competition, { targetKey: 'id', foreignKey: 'competition_id', as: 'competition' })
  getCompetition: BelongsToGetAssociationMixin<Competition>;
}
