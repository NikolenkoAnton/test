import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import sequelize, { BelongsToGetAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import Competition from './Competition';
import TemplateMarketGroup from './TemplateMarketGroup';
import TemplateTime from './TemplateTime';
import Sport from './Sport';
import Team from './Team';

@Table({ timestamps: true, tableName: 'bb_template', freezeTableName: true, underscored: true })
export default class Template extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Sport)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'template_sport_id_name_section_unique',
    references: { model: 'bb_sport', key: 'id' },
  })
  sport_id: number;

  @Column({ type: new DataType.STRING(32), allowNull: false, unique: 'template_sport_id_name_section_unique' })
  name: string;

  @Column({ type: new DataType.STRING(8), allowNull: false, unique: 'template_sport_id_name_section_unique' })
  section: string;

  @Default(100)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  weight: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  is_default: number;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Sport, { targetKey: 'id', foreignKey: 'sport_id', as: 'sport' })
  getSport: BelongsToGetAssociationMixin<Sport>;

  @HasMany(() => Team, { sourceKey: 'id', foreignKey: 'template_live_id', as: 'teamsWhereTemplateLive' })
  getTeamsWhereTemplateLive: HasManyGetAssociationsMixin<Team>;
  @HasMany(() => Team, { sourceKey: 'id', foreignKey: 'template_prematch_id', as: 'teamsWhereTemplatePrematch' })
  getTeamsWhereTemplatePrematch: HasManyGetAssociationsMixin<Team>;
  @HasMany(() => TemplateMarketGroup, { sourceKey: 'id', foreignKey: 'template_id', as: 'templateMarketGroups' })
  getTemplateMarketGroups: HasManyGetAssociationsMixin<TemplateMarketGroup>;
  @HasMany(() => Competition, { sourceKey: 'id', foreignKey: 'template_live_id', as: 'competitionsWhereTemplateLive' })
  getCompetitionsWhereTemplateLive: HasManyGetAssociationsMixin<Competition>;
  @HasMany(() => Competition, {
    sourceKey: 'id',
    foreignKey: 'template_prematch_id',
    as: 'competitionsWhereTemplatePrematch',
  })
  getCompetitionsWhereTemplatePrematch: HasManyGetAssociationsMixin<Competition>;
  @HasMany(() => TemplateTime, { sourceKey: 'id', foreignKey: 'template_id', as: 'templateTimes' })
  getTemplateTimes: HasManyGetAssociationsMixin<TemplateTime>;
}
