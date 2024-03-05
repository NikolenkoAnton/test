import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey } from 'sequelize-typescript';
import { ApiModelProperty } from 'swagger-express-ts';
import { CustomTable } from './Base';
import ExternalBanner from './ExternalBanner';

@CustomTable('bb_cms_external_banner_event', false)
export default class ExternalBannerEvent extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

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

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: false })
  sport_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: true })
  category_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: true })
  competition_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: true })
  ss_competition_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: true })
  ss_sport_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: true })
  ss_category_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: true })
  event_id: number;

  @ApiModelProperty()
  @Column(new DataType.TEXT())
  alias: string;
}
