import { AutoIncrement, Column, DataType, ForeignKey, HasOne, Model, PrimaryKey } from 'sequelize-typescript';
import { ApiModelProperty } from 'swagger-express-ts';
import { CustomTable } from './Base';
import ExternalBanner from './ExternalBanner';
import { Country } from './index';

@CustomTable('bb_cms_external_banner_to_country', false)
export default class ExternalBannerToCountry extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Column({
    type: new DataType.INTEGER(),
    references: {
      model: 'Country',
      key: 'id',
    },
    onDelete: 'CASCADE',
    allowNull: false,
  })
  @ForeignKey(() => Country)
  country_id: number;

  @ApiModelProperty()
  @Column({
    type: new DataType.INTEGER(),
    references: {
      model: 'ExternalBannerSlide',
      key: 'id',
    },
    onDelete: 'CASCADE',
    allowNull: false,
  })
  @ForeignKey(() => ExternalBanner)
  external_banner_id: number;

  @HasOne(() => Country, { sourceKey: 'country_id', foreignKey: 'id', as: 'value' })
  value: Country;
}
