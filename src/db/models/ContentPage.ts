import { AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel()
@Table({ timestamps: false, tableName: 'bb_content_page', freezeTableName: true, underscored: true })
export default class ContentPage extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Column({ type: DataType.TEXT, allowNull: false })
  title: string;

  @ApiModelProperty()
  @Column({ type: DataType.TEXT, allowNull: true })
  url: string;

  @ApiModelProperty()
  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  parent: number;

  @ApiModelProperty()
  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  position: number;
}
