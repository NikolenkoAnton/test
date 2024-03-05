import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import sequelize, {
  BelongsToGetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasOneGetAssociationMixin,
} from 'sequelize';
import CategoryStat from './CategoryStat';
import Competition from './Competition';
import Platform from './Platform';
import PlatformCategory from './PlatformCategory';
import Sport from './Sport';
import EntityOrder from './EntityOrder';

@Table({ timestamps: false, tableName: 'bb_category', freezeTableName: true, underscored: true })
export default class Category extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Sport)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_sport', key: 'id' } })
  sport_id: number;

  @Column(new DataType.STRING(64))
  external_id: string;

  @Column(new DataType.STRING(128))
  en: string;

  @Column(new DataType.STRING(128))
  ru: string;

  @Column(new DataType.STRING(128))
  tr: string;

  @Column(new DataType.STRING(128))
  uk: string;

  @Default(50)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  weight: number;

  @Column(new DataType.STRING(128))
  alias: string;

  @Column(new DataType.STRING(255))
  comment: string;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  pool: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  profit: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  margin: number;

  @Default(0)
  @Column({ type: DataType.BIGINT, allowNull: false })
  quantity: number;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @Column(DataType.DATE)
  deleted_at: Date;

  @BelongsTo(() => Sport, { targetKey: 'id', foreignKey: 'sport_id', as: 'sport' })
  getSport: BelongsToGetAssociationMixin<Sport>;

  @HasOne(() => CategoryStat, { sourceKey: 'id', foreignKey: 'category_id', as: 'categoryStat' })
  getCategoryStat: HasOneGetAssociationMixin<CategoryStat>;
  @HasMany(() => Competition, { sourceKey: 'id', foreignKey: 'category_id', as: 'competitions' })
  getCompetitions: HasManyGetAssociationsMixin<Competition>;
  // @HasMany(() => Sport, {sourceKey: 'id', foreignKey: 'category_id', as: 'sports'})
  // getSports: HasManyGetAssociationsMixin<Sport>;
  @HasMany(() => Platform, { sourceKey: 'id', foreignKey: 'category_id', as: 'platforms' })
  getPlatforms: HasManyGetAssociationsMixin<Platform>;
  @HasMany(() => PlatformCategory, { sourceKey: 'id', foreignKey: 'category_id', as: 'platformCategories' })
  getPlatformCategories: HasManyGetAssociationsMixin<PlatformCategory>;
}
