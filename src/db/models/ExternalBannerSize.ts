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

@CustomTable('bb_cms_external_banner_size', false)
export default class ExternalBannerSize extends Model {
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
    type: new DataType.STRING(64),
    allowNull: false,
    unique: 'bb_cms_external_banner_slide_size_unique',
  })
  label: string;

  @ApiModelProperty()
  @Column({
    type: new DataType.ENUM('desktop', 'mobile'),
    allowNull: false,
  })
  type: string;
}
