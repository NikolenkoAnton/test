import {
  AutoIncrement,
  Column,
  DataType,
  Default,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import CmsImageItem from './CmsImageItem';
import { HasManyGetAssociationsMixin } from 'sequelize';
import { TEASER_EVENT_STATUS_ENUM } from '../../helper/constants';
import { CmsImageItemToEntity } from './index';
import { addMinutes } from 'date-fns';

@ApiModel()
@Table({ timestamps: false, tableName: 'bb_cms_teaser', freezeTableName: true, underscored: true })
export default class Teaser extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Default(100)
  @Column({ type: DataType.INTEGER, allowNull: false })
  position: number;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  active: number;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Default(1)
  @Column(DataType.SMALLINT)
  has_game: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: false })
  sport_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: false })
  category_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: false })
  competition_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: false })
  ss_competition_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: true })
  event_id: number;

  @ApiModelProperty({
    example: ['teams_logo', 'background_image'],
  })
  @Column({
    type: DataType.STRING(128),
    allowNull: false,
  })
  type: string;

  @ApiModelProperty({
    example: [Object.values(TEASER_EVENT_STATUS_ENUM)],
  })
  @Column({ type: DataType.STRING(32), allowNull: false })
  event_status: string;

  @ApiModelProperty({
    description: 'Time to show teaser before event in hours',
  })
  @Column({ type: DataType.INTEGER, allowNull: true })
  delay_before_event: number;

  @ApiModelProperty({
    description: 'generated string Sport / Category / Competition / Event',
  })
  @Column(new DataType.STRING(256))
  teaser_alias: string;

  @HasMany(() => CmsImageItemToEntity, { sourceKey: 'id', foreignKey: 'entity_id', as: 'cmsImageItems' })
  getCmsImageItems: HasManyGetAssociationsMixin<CmsImageItemToEntity>;

  @Column(DataType.VIRTUAL(new DataType.DECIMAL(12, 2)))
  get start_to(): Date {
    return addMinutes(new Date(), this.getDataValue('delay_before_event') || 0);
  }
}
