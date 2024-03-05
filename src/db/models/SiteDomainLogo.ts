import { ApiModelProperty } from 'swagger-express-ts';
import { AutoIncrement, Column, DataType, HasOne, Model, PrimaryKey } from 'sequelize-typescript';
import { CustomTable } from './Base';
import CmsImageItem from './CmsImageItem';

@CustomTable('bb_site_domain_logo', false)
export default class SiteDomainLogo extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_site_domain', key: 'id' } })
  site_domain_id: number;

  @ApiModelProperty()
  @Column({
    type: new DataType.ENUM('big_logo', 'small_logo', 'favicon'),
    allowNull: false,
  })
  type: string;

  @ApiModelProperty()
  @Column(DataType.INTEGER)
  cms_image_item_id?: number;

  @HasOne(() => CmsImageItem, { sourceKey: 'cms_image_item_id', foreignKey: 'id', as: 'cmsImageItem' })
  cmsImageItem?: CmsImageItem;
}
