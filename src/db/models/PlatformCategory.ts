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
import Category from './Category';
import Platform from './Platform';

@Table({ timestamps: true, tableName: 'bb_platform_category', freezeTableName: true, underscored: true })
export default class PlatformCategory extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Platform)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'platform_category_UNIQUE',
    references: { model: 'bb_platform', key: 'id' },
  })
  platform_id: number;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'platform_category_UNIQUE',
    references: { model: 'bb_category', key: 'id' },
  })
  category_id: number;

  @Default(100)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  sort: number;

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

  @BelongsTo(() => Category, { targetKey: 'id', foreignKey: 'category_id', as: 'category' })
  getCategory: BelongsToGetAssociationMixin<Category>;
  @BelongsTo(() => Platform, { targetKey: 'id', foreignKey: 'platform_id', as: 'platform' })
  getPlatform: BelongsToGetAssociationMixin<Platform>;
}
