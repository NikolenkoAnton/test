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
import CompetitionStat from './CompetitionStat';
import PlatformCompetition from './PlatformCompetition';
import Sport from './Sport';
import Category from './Category';
import Template from './Template';
import Game from './Game';
import EntityOrder from './EntityOrder';

@Table({ timestamps: false, tableName: 'bb_competition', freezeTableName: true, underscored: true })
export default class Competition extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Sport)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_sport', key: 'id' } })
  sport_id: number;

  @ForeignKey(() => Category)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_category', key: 'id' } })
  category_id: number;

  @ForeignKey(() => Template)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_template', key: 'id' } })
  template_prematch_id: number;

  @ForeignKey(() => Template)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_template', key: 'id' } })
  template_live_id: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  all_teams: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  show_banners: number;

  @Column(new DataType.STRING(128))
  en: string;

  @Column(new DataType.STRING(128))
  ru: string;

  @Column(new DataType.STRING(128))
  tr: string;

  @Column(new DataType.STRING(128))
  uk: string;

  @Column(DataType.JSON)
  rules: any;

  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  enabled: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  top: number;

  @Default(50)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  weight: number;

  @Column(new DataType.STRING(6))
  gender: string;

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

  @CreatedAt
  @Column(DataType.DATE)
  deleted_at: Date;

  @Column(new DataType.STRING(64))
  external_id: string;

  @HasMany(() => Game, { sourceKey: 'id', foreignKey: 'competition_id', as: 'games' })
  getGames: HasManyGetAssociationsMixin<Game>;
  @HasOne(() => CompetitionStat, { sourceKey: 'id', foreignKey: 'competition_id', as: 'competitionStat' })
  getCompetitionStat: HasOneGetAssociationMixin<CompetitionStat>;
  @HasMany(() => PlatformCompetition, { sourceKey: 'id', foreignKey: 'competition_id', as: 'platformCompetitions' })
  getPlatformCompetitions: HasManyGetAssociationsMixin<PlatformCompetition>;
  @HasOne(() => Sport, { sourceKey: 'sport_id', foreignKey: 'id', as: 'sport' })
  getSport: HasOneGetAssociationMixin<Sport>;
  @HasOne(() => Category, { sourceKey: 'category_id', foreignKey: 'id', as: 'category' })
  getCategory: HasOneGetAssociationMixin<Category>;
  @BelongsTo(() => Template, { targetKey: 'id', foreignKey: 'template_prematch_id', as: 'templatePrematch' })
  getTemplatePrematch: BelongsToGetAssociationMixin<Template>;
  @BelongsTo(() => Template, { targetKey: 'id', foreignKey: 'template_live_id', as: 'templateLive' })
  getTemplateLive: BelongsToGetAssociationMixin<Template>;
}
