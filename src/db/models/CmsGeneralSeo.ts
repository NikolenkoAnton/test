import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
@ApiModel({
  name: 'CmsGeneralSeo',
})
@Table({ timestamps: true, tableName: 'bb_cms_general_seo', freezeTableName: true, underscored: true })
export default class CmsGeneralSeo extends Model {
  @PrimaryKey
  @AutoIncrement
  @ApiModelProperty()
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Column(new DataType.STRING(256))
  block: string;

  @ApiModelProperty()
  @Column(new DataType.INTEGER)
  site_domain_id: number;

  @ApiModelProperty()
  @Column(new DataType.STRING(256))
  key: string;

  @ApiModelProperty()
  @Column(new DataType.TEXT())
  value: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
