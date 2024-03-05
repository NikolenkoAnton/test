import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import Agent from './Agent';
import PlatformCategory from './PlatformCategory';
import PlatformCompetition from './PlatformCompetition';
import PlatformSport from './PlatformSport';
import PlatformTeam from './PlatformTeam';
import PlatformUser from './PlatformUser';
import Point from './Point';
import Category from './Category';

@Table({ timestamps: true, tableName: 'bb_platform', freezeTableName: true, underscored: true })
export default class Platform extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: new DataType.STRING(64), unique: 'name_UNIQUE' })
  name: string;

  @Column({ type: new DataType.STRING(64), unique: 'pid_UNIQUE' })
  pid: string;

  @ForeignKey(() => Point)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_point', key: 'id' } })
  point_id: number;

  @ForeignKey(() => Category)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_category', key: 'id' } })
  category_id: number;

  @Column({ type: new DataType.STRING(64), unique: 'special_key_UNIQUE' })
  special_key: string;

  @Column(DataType.TEXT)
  public_key: string;

  @Column({ type: DataType.BIGINT, allowNull: false })
  currency_id: number;

  @Column(DataType.BIGINT)
  country_id: number;

  @Column(DataType.JSON)
  data: any;

  @Column(DataType.JSON)
  keys: any;

  @Column(DataType.JSON)
  settings: any;

  @Column(DataType.JSON)
  white_list: any;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Point, { targetKey: 'id', foreignKey: 'point_id', as: 'point' })
  getPoint: BelongsToGetAssociationMixin<Point>;
  @BelongsTo(() => Category, { targetKey: 'id', foreignKey: 'category_id', as: 'category' })
  getCategory: BelongsToGetAssociationMixin<Category>;

  @HasMany(() => Agent, { sourceKey: 'id', foreignKey: 'platform_id', as: 'agents' })
  getAgents: HasManyGetAssociationsMixin<Agent>;
  @HasMany(() => PlatformCategory, { sourceKey: 'id', foreignKey: 'platform_id', as: 'platformCategories' })
  getPlatformCategories: HasManyGetAssociationsMixin<PlatformCategory>;
  @HasMany(() => PlatformCompetition, { sourceKey: 'id', foreignKey: 'platform_id', as: 'platformCompetitions' })
  getPlatformCompetitions: HasManyGetAssociationsMixin<PlatformCompetition>;
  @HasMany(() => PlatformSport, { sourceKey: 'id', foreignKey: 'platform_id', as: 'platformSports' })
  getPlatformSports: HasManyGetAssociationsMixin<PlatformSport>;
  @HasMany(() => PlatformTeam, { sourceKey: 'id', foreignKey: 'platform_id', as: 'platformTeams' })
  getPlatformTeams: HasManyGetAssociationsMixin<PlatformTeam>;
  @HasMany(() => PlatformUser, { sourceKey: 'id', foreignKey: 'platform_id', as: 'platformUsers' })
  getPlatformUsers: HasManyGetAssociationsMixin<PlatformUser>;
}
