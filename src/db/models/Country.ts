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
import Team from './Team';
import User from './User';
import Currency from './Currency';
import { CustomTable } from './Base';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({ name: 'Country' })
@Table({ timestamps: false, tableName: 'bb_country', freezeTableName: true, underscored: true })
// @CustomTable('bb_country', false)
export default class Country extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @ForeignKey(() => Currency)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_currency', key: 'id' } })
  currency_id: number;

  @ApiModelProperty()
  @Column({ type: new DataType.STRING(2), unique: 'alpha2_UNIQUE' })
  alpha2: string;

  @ApiModelProperty()
  @Column({ type: new DataType.STRING(3), allowNull: false, unique: 'country_code_unique' })
  alpha3: string;

  @ApiModelProperty()
  @Column({ type: new DataType.STRING(128), unique: 'country_ru_unique' })
  ru: string;

  @ApiModelProperty()
  @Column({ type: new DataType.STRING(128), unique: 'country_en_unique' })
  en: string;

  @ApiModelProperty()
  @Column({ type: new DataType.STRING(128), unique: 'country_uk_unique' })
  uk: string;

  @ApiModelProperty()
  @Default(100)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  weight: string;

  @BelongsTo(() => Currency, { targetKey: 'id', foreignKey: 'currency_id', as: 'currency' })
  getCurrency: BelongsToGetAssociationMixin<Currency>;

  @HasMany(() => Team, { sourceKey: 'id', foreignKey: 'country_id', as: 'teams' })
  getTeams: HasManyGetAssociationsMixin<Team>;
  @HasMany(() => User, { sourceKey: 'id', foreignKey: 'country_id', as: 'users' })
  getUsers: HasManyGetAssociationsMixin<User>;
}
