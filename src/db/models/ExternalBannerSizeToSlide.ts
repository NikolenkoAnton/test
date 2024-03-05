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
import { ApiModelProperty } from 'swagger-express-ts';
import { CustomTable } from './Base';
import ExternalBanner from './ExternalBanner';
import ExternalBannerSize from './ExternalBannerSize';

@CustomTable('bb_cms_external_banner_size_to_slide', false)
export default class ExternalBannerSizeToSlide extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Column({
    type: new DataType.INTEGER(),
    references: {
      model: 'ExternalBannerSize',
      key: 'id',
    },
    onDelete: 'CASCADE',
    allowNull: false,
  })
  @ForeignKey(() => ExternalBannerSize)
  size_id: number;

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

  @HasOne(() => ExternalBannerSize, { sourceKey: 'size_id', foreignKey: 'id', as: 'value' })
  value: ExternalBannerSize;

  @ApiModelProperty()
  @Column(DataType.VIRTUAL(DataType.STRING))
  get link(): string {
    return this.getDataValue('link');
  }

  set link(value: string) {
    this.setDataValue('link', value);
  }
}
