import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ApiModelProperty } from 'swagger-express-ts';
import TranslateLanguage from './TranslateLanguage';
import MainBannerSlide from './MainBannerSlide';
import SiteDomain from './SiteDomain';

@Table({
  timestamps: false,
  tableName: 'bb_competition_top_text_value',
  freezeTableName: true,
  underscored: true,
})
export default class CompetitionTopTextValue extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @ForeignKey(() => MainBannerSlide)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_competition_top', key: 'id' } })
  top_competition_id: string;

  @ApiModelProperty()
  @Column({ type: new DataType.TEXT(), allowNull: true })
  name: string;

  @ApiModelProperty()
  @ForeignKey(() => TranslateLanguage)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_translate_language', key: 'id' } })
  language_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_site_domain', key: 'id' } })
  site_domain_id: number;

  @ApiModelProperty({
    model: 'TranslateLanguage',
  })
  @BelongsTo(() => TranslateLanguage, { targetKey: 'id', foreignKey: 'language_id', as: 'language' })
  language: TranslateLanguage;

  @ApiModelProperty({
    model: 'SiteDomain',
  })
  @BelongsTo(() => SiteDomain, { targetKey: 'id', foreignKey: 'site_domain_id', as: 'site_domain' })
  site_domain: SiteDomain;
}
