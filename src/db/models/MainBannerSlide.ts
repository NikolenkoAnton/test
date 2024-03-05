import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Default,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import CmsImageItem from './CmsImageItem';
import { HasManyGetAssociationsMixin } from 'sequelize';
import MainBannerSlideTextValue from './MainBannerSlideTextValue';
import { MAIN_BANNER_SLIDE_TYPE_ENUM } from '../../helper/constants';
import PlatformGroup from './PlatformGroup';
import CmsBannerMainSlideGroup from './CmsBannerMainSlideGroup';

@Table({ timestamps: false, tableName: 'bb_cms_banner_main_slide', freezeTableName: true, underscored: true })
export default class MainBannerSlide extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Default(100)
  @Column({ type: DataType.INTEGER, allowNull: false })
  position: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: true })
  cms_image_item_id: number;

  @ApiModelProperty({
    example: Object.values(MAIN_BANNER_SLIDE_TYPE_ENUM),
    description: `
      ${MAIN_BANNER_SLIDE_TYPE_ENUM.HALF_IMAGE_WITH_BUTTON} - Transparent with button
      ${MAIN_BANNER_SLIDE_TYPE_ENUM.HALF_IMAGE_NO_BUTTON} - Transparent without button
      ${MAIN_BANNER_SLIDE_TYPE_ENUM.FULL_IMAGE_WITH_BUTTON} - Full image with button
      ${MAIN_BANNER_SLIDE_TYPE_ENUM.FULL_IMAGE_NO_BUTTON} - Full image without button
    `,
  })
  @Column({ type: new DataType.STRING(32), allowNull: false })
  type: string;

  @ApiModelProperty()
  @Column({ type: new DataType.TEXT(), allowNull: true })
  external?: string;

  @ApiModelProperty({
    example: ['now', 'scheduled'],
  })
  @Column({ type: new DataType.STRING(64), allowNull: false })
  schedule: string;

  @ApiModelProperty()
  @Column({ type: DataType.DATEONLY, allowNull: true })
  schedule_start_date: string;

  @ApiModelProperty()
  @Column({ type: DataType.TIME, allowNull: true })
  schedule_start_time: string;

  @ApiModelProperty()
  @Column(DataType.DATEONLY)
  schedule_finish_date: string;

  @ApiModelProperty()
  @Column({ type: DataType.TIME, allowNull: true })
  schedule_finish_time: string;

  @Column({ type: DataType.STRING, allowNull: true })
  schedule_type: string;

  @Column({ type: new DataType.ARRAY(new DataType.INTEGER()), allowNull: true })
  schedule_days: number[];

  @Column({ type: DataType.STRING, allowNull: true })
  time_zone: string;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  active: number;

  @ApiModelProperty({
    example: '#000000',
  })
  @Default('#000000')
  @Column({ type: DataType.STRING(32), allowNull: false })
  title_color: string;

  @BelongsToMany(() => PlatformGroup, () => CmsBannerMainSlideGroup)
  groups: PlatformGroup[];

  @ApiModelProperty({
    example: '#000000',
  })
  @Default('#000000')
  @Column({ type: DataType.STRING(32), allowNull: false })
  small_text_color: string;

  @ApiModelProperty({
    example: '#000000',
  })
  @Column({ type: DataType.STRING(32), allowNull: true })
  background_color: string;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.Model.Property.Type.BOOLEAN })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  display_for_logged_in: boolean;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.Model.Property.Type.BOOLEAN })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  display_for_not_logged_in: boolean;

  @HasOne(() => CmsImageItem, { sourceKey: 'cms_image_item_id', foreignKey: 'id', as: 'cmsImageItem' })
  getCmsImageItem: HasManyGetAssociationsMixin<CmsImageItem>;

  @HasMany(() => MainBannerSlideTextValue, {
    sourceKey: 'id',
    foreignKey: 'slide_id',
    as: 'text_values',
  })
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY,
    model: 'MainBannerSlideTextValue',
  })
  text_values: MainBannerSlideTextValue[];

  @Column(DataType.VIRTUAL(DataType.STRING))
  get title(): string {
    return this.getDataValue('title');
  }

  set title(value: string) {
    this.setDataValue('title', value);
  }
}
