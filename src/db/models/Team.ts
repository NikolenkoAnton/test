import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
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
import GameTeam from './GameTeam';
import PlatformTeam from './PlatformTeam';
import TeamStat from './TeamStat';
import Country from './Country';
import Sport from './Sport';
import Template from './Template';
import Game from './Game';

@Table({ timestamps: false, tableName: 'bb_team', freezeTableName: true, underscored: true })
export default class Team extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => Country)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_country', key: 'id' } })
  country_id: number;

  @Column(DataType.BIGINT)
  category_id: number;

  @ForeignKey(() => Sport)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_sport', key: 'id' } })
  sport_id: number;

  @ForeignKey(() => Template)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_template', key: 'id' } })
  template_prematch_id: number;

  @ForeignKey(() => Template)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_template', key: 'id' } })
  template_live_id: number;

  @Column(new DataType.STRING(6))
  gender: string;

  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  enabled: string;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  top: string;

  @Column(new DataType.STRING(128))
  en: string;

  @Column(new DataType.STRING(128))
  ru: string;

  @Column(new DataType.STRING(128))
  tr: string;

  @Column(new DataType.STRING(128))
  uk: string;

  @Column(new DataType.STRING(128))
  icon: string;

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

  @BelongsToMany(() => Game, () => GameTeam)
  games: Game[];

  @Column(new DataType.STRING(64))
  external_id: string;

  @BelongsTo(() => Sport, { targetKey: 'id', foreignKey: 'sport_id', as: 'sport' })
  getSport: BelongsToGetAssociationMixin<Sport>;
  @BelongsTo(() => Country, { targetKey: 'id', foreignKey: 'country_id', as: 'country' })
  getCountry: BelongsToGetAssociationMixin<Country>;
  @BelongsTo(() => Template, { targetKey: 'id', foreignKey: 'template_live_id', as: 'templateLive' })
  getTemplateLive: BelongsToGetAssociationMixin<Template>;
  @BelongsTo(() => Template, { targetKey: 'id', foreignKey: 'template_prematch_id', as: 'templatePrematch' })
  getTemplatePrematch: BelongsToGetAssociationMixin<Template>;

  @HasMany(() => GameTeam, { sourceKey: 'id', foreignKey: 'team_id', as: 'gameTeams' })
  getGameTeams: HasManyGetAssociationsMixin<GameTeam>;
  @HasMany(() => PlatformTeam, { sourceKey: 'id', foreignKey: 'team_id', as: 'platformTeams' })
  getPlatformTeams: HasManyGetAssociationsMixin<PlatformTeam>;
  @HasOne(() => TeamStat, { sourceKey: 'id', foreignKey: 'team_id', as: 'teamStat' })
  getTeamStat: HasOneGetAssociationMixin<TeamStat>;
}
