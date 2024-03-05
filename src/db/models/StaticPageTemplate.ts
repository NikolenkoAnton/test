import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ApiModelProperty } from 'swagger-express-ts';

@Table({ timestamps: false, tableName: 'bb_cms_static_page_template', freezeTableName: true, underscored: true })
export default class StaticPageTemplate extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Column({ type: new DataType.STRING(255), allowNull: false })
  name: string;

  @ApiModelProperty()
  @Column({ type: new DataType.STRING(255), allowNull: false })
  type: string;
}
