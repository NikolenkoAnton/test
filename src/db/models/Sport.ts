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
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import sequelize, {
  BelongsToGetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasOneGetAssociationMixin,
} from 'sequelize';
import Category from './Category';
import Competition from './Competition';
import MarketGroup from './MarketGroup';
import PlatformSport from './PlatformSport';
import SportStat from './SportStat';
import Team from './Team';
import Template from './Template';
import EntityOrder from './EntityOrder';

@ApiModel({
  name: 'DBSport',
})
@Table({ timestamps: true, tableName: 'bb_sport', freezeTableName: true, underscored: true })
export default class Sport extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @ForeignKey(() => MarketGroup)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_market_group', key: 'id' } })
  market_group_id: number;

  @ApiModelProperty()
  @ForeignKey(() => MarketGroup)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_market_group', key: 'id' } })
  first_additional_market_group_id: number;

  @ApiModelProperty()
  @ForeignKey(() => MarketGroup)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_market_group', key: 'id' } })
  second_additional_market_group_id: number;

  @ApiModelProperty()
  @Column(new DataType.STRING(128))
  alias: string;

  @ApiModelProperty()
  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  enabled: number;

  @ApiModelProperty({
    example: 'football',
  })
  @Default('football')
  @Column({ type: new DataType.STRING(32), allowNull: false })
  view: string;

  @ApiModelProperty()
  @Column(new DataType.STRING(128))
  en: string;

  @ApiModelProperty({
    example: 50,
  })
  @Default(50)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  weight: number;

  @ApiModelProperty({
    example: 0,
  })
  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  esport: number;

  @ApiModelProperty()
  @Column(new DataType.STRING(64))
  external_id: string;

  @ApiModelProperty()
  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  created_at: Date;

  @ApiModelProperty()
  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => MarketGroup, { targetKey: 'id', foreignKey: 'market_group_id', as: 'marketGroup' })
  getMarketGroup: BelongsToGetAssociationMixin<MarketGroup>;
  @BelongsTo(() => MarketGroup, {
    targetKey: 'id',
    foreignKey: 'first_additional_market_group_id',
    as: 'firstAdditionalMarketGroup',
  })
  getFirstAdditionalMarketGroup: BelongsToGetAssociationMixin<MarketGroup>;
  @BelongsTo(() => MarketGroup, {
    targetKey: 'id',
    foreignKey: 'second_additional_market_group_id',
    as: 'secondAdditionalMarketGroup',
  })
  getSecondAdditionalMarketGroup: BelongsToGetAssociationMixin<MarketGroup>;

  @HasMany(() => MarketGroup, { sourceKey: 'id', foreignKey: 'sport_id', as: 'betradarMarketGroups' })
  getBetradarMarketGroup: HasManyGetAssociationsMixin<MarketGroup>;
  @HasMany(() => Category, { sourceKey: 'id', foreignKey: 'sport_id', as: 'categories' })
  getCategory: HasManyGetAssociationsMixin<Category>;
  @HasMany(() => Competition, { sourceKey: 'id', foreignKey: 'sport_id', as: 'competitions' })
  getCompetitions: HasManyGetAssociationsMixin<Competition>;
  @HasMany(() => PlatformSport, { sourceKey: 'id', foreignKey: 'sport_id', as: 'platformSports' })
  getPlatformSports: HasManyGetAssociationsMixin<PlatformSport>;
  @HasOne(() => SportStat, { sourceKey: 'id', foreignKey: 'sport_id', as: 'sportStat' })
  getSportStat: HasOneGetAssociationMixin<SportStat>;
  @HasMany(() => Team, { sourceKey: 'id', foreignKey: 'sport_id', as: 'teams' })
  getTeams: HasManyGetAssociationsMixin<Team>;
  @HasMany(() => Template, { sourceKey: 'id', foreignKey: 'sport_id', as: 'templates' })
  getTemplates: HasManyGetAssociationsMixin<Template>;
}
