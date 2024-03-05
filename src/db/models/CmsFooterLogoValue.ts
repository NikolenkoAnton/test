import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import SiteDomain from './SiteDomain';
import { ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import CmsImageItem from './CmsImageItem';
import { CmsFooterLogo } from './index';

@Table({ timestamps: false, tableName: 'bb_cms_footer_logo_value', freezeTableName: true, underscored: true })
export default class CmsFooterLogoValue extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @ForeignKey(() => CmsFooterLogo)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: 'CmsFooterLogo', key: 'id' },
    onDelete: 'CASCADE',
  })
  cms_footer_logo_id: number;

  @ApiModelProperty()
  @ForeignKey(() => SiteDomain)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: 'SiteDomain', key: 'id' },
    onDelete: 'CASCADE',
  })
  site_domain_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.TEXT, allowNull: true })
  url: string;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: true })
  cms_image_item_id: number;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Model.Property.Type.OBJECT,
    example: {
      url: SwaggerDefinitionConstant.Model.Property.Type.STRING,
    },
  })
  @BelongsTo(() => SiteDomain, { targetKey: 'id', foreignKey: 'site_domain_id', as: 'site_domain' })
  site_domain: SiteDomain;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Model.Property.Type.OBJECT,
    example: {
      uuid: SwaggerDefinitionConstant.Model.Property.Type.STRING,
      extension: SwaggerDefinitionConstant.Model.Property.Type.STRING,
      cmsImage: {
        name: SwaggerDefinitionConstant.Model.Property.Type.STRING,
      },
    },
  })
  @HasOne(() => CmsImageItem, { sourceKey: 'cms_image_item_id', foreignKey: 'id', as: 'cmsImageItem' })
  cmsImageItem: CmsImageItem;
}
