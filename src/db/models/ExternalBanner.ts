import {
  AutoIncrement,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
} from 'sequelize-typescript';
import { ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { CustomTable } from './Base';
import ExternalBannerSizeToSlide from './ExternalBannerSizeToSlide';
import ExternalBannerSlideType from './ExternalBannerSlideType';
import ExternalBannerEvent from './ExternalBannerEvent';
import { ExternalBannerToCountry } from './index';

@CustomTable('bb_cms_external_banner', false)
export default class ExternalBanner extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Column({
    type: new DataType.TEXT(),
    allowNull: false,
  })
  name: string;

  @ApiModelProperty()
  @Column({
    type: new DataType.INTEGER(),
    references: {
      model: 'ExternalBannerSlideType',
      key: 'id',
    },
    onDelete: 'CASCADE',
    allowNull: false,
  })
  @ForeignKey(() => ExternalBannerSlideType)
  type: number;

  @ApiModelProperty({
    description: 'Time to show teaser before event',
  })
  @Column({ type: DataType.INTEGER, allowNull: true })
  delay_before_event: number;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  active: number;

  @ApiModelProperty()
  @Column({
    type: new DataType.UUID(),
  })
  uuid: string;

  @ApiModelProperty()
  @Column(DataType.DATE)
  processed_at: Date;

  @ApiModelProperty({
    description: 'Time Zone for Start Time Event',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  time_zone: string;

  @HasMany(() => ExternalBannerSizeToSlide, {
    sourceKey: 'id',
    foreignKey: 'external_banner_id',
    as: 'sizes',
  })
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY,
    model: 'ExternalBannerSizeToSlide',
    example: [
      {
        size_id: 3,
        value: {
          name: 'Wide Skyscraper (160*600)',
          label: '160x600',
          type: 'desktop',
        },
        link: 'https://todo-change-after-service-creation/external-banner-slide?slide_id=8&size_id=3',
      },
    ],
  })
  sizes: ExternalBannerSizeToSlide[];

  @HasMany(() => ExternalBannerEvent, {
    sourceKey: 'id',
    foreignKey: 'external_banner_id',
    as: 'events',
  })
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY,
    model: 'ExternalBannerEvent',
    example: [
      {
        sport_id: 1,
        category_id: 30,
        competition_id: 35,
        ss_competition_id: 364169,
        event_id: 34169483,
        alias: 'Soccer / Germany / Bundesliga / VfL Bochum - Borussia Dortmund',
      },
    ],
  })
  events: ExternalBannerEvent[];

  @HasMany(() => ExternalBannerToCountry, {
    sourceKey: 'id',
    foreignKey: 'external_banner_id',
    as: 'countries',
  })
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY,
    model: 'ExternalBannerSlideToCountry',
    example: [
      {
        country_id: 4,
        value: {
          currency_id: 7,
          alpha2: 'AI',
          alpha3: 'AIA',
          ru: 'Ангилья',
          en: 'Anguilla',
          uk: null,
          weight: 100,
        },
      },
    ],
  })
  countries: ExternalBannerToCountry[];
}
