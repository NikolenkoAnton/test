import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  PrimaryKey,
  Scopes,
  UpdatedAt,
} from 'sequelize-typescript';
import { BaseModel, CustomTable } from './Base';
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';

@Scopes(() => ({
  sorted: {
    order: [['created_at', 'DESC']],
  },
}))
@CustomTable('bb_cms_files')
@ApiModel({ name: 'CmsFile' })
export default class CmsFile extends BaseModel {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Column({ type: new DataType.TEXT(), allowNull: false })
  name: string;

  @ApiModelProperty()
  @Column({ type: new DataType.TEXT(), allowNull: false })
  uuid: string;

  @ApiModelProperty()
  @Column({ type: new DataType.STRING(32), allowNull: false })
  extension: string;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.STRING,
  })
  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.STRING,
  })
  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
