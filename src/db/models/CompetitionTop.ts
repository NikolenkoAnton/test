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
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import CmsImageItem from './CmsImageItem';
import { HasManyGetAssociationsMixin } from 'sequelize';
import CmsImageItemToEntity from './CmsImageItemToEntity';
import CompetitionTopTextValue from './CompetitionTopTextValue';

@ApiModel()
@Table({ timestamps: false, tableName: 'bb_competition_top', freezeTableName: true, underscored: true })
export default class CompetitionTop extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Column({ type: DataType.TEXT, allowNull: false })
  slug: string;

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
  competition_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: false })
  ss_competition_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: false })
  sport_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: false })
  category_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: true })
  cms_image_item_id: number;

  @ApiModelProperty({
    example: '#000000',
  })
  @Default('#000000')
  @Column(new DataType.STRING(32))
  color: string;

  @ApiModelProperty()
  @Column(new DataType.STRING(255))
  category_alias: string;

  @HasMany(() => CmsImageItemToEntity, { sourceKey: 'id', foreignKey: 'entity_id', as: 'cmsImageItems' })
  cms_image_items: CmsImageItemToEntity[];

  @HasOne(() => CmsImageItem, { sourceKey: 'cms_image_item_id', foreignKey: 'id', as: 'cmsImageItem' })
  getCmsImageItem: HasManyGetAssociationsMixin<CmsImageItem>;

  @HasMany(() => CompetitionTopTextValue, {
    sourceKey: 'id',
    foreignKey: 'top_competition_id',
    as: 'text_values',
  })
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY,
    model: 'CompetitionTopTextValue',
  })
  text_values: CompetitionTopTextValue[];

  @Column(DataType.VIRTUAL(DataType.STRING))
  get name(): string {
    return this.getDataValue('name');
  }

  set name(value: string) {
    this.setDataValue('name', value);
  }
}
