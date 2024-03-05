import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import StaticPageTemplate from './StaticPageTemplate';
import StaticPageValue from './StaticPageValue';

@Table({ timestamps: true, tableName: 'bb_cms_static_page', freezeTableName: true, underscored: true })
export default class StaticPage extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Column({ type: new DataType.TEXT(), allowNull: false, unique: 'slug' })
  slug: string;

  @ApiModelProperty()
  @Column({ type: new DataType.TEXT(), allowNull: false })
  title: string;

  @ApiModelProperty()
  @ForeignKey(() => StaticPageTemplate)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_cms_static_page_template', key: 'id' } })
  template_id: number;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  active: number;

  @ApiModelProperty({ type: 'string', format: 'date-time' })
  @UpdatedAt
  @Column(DataType.DATE)
  delete_after: Date;

  @ApiModelProperty({
    example: ['now', 'scheduled'],
  })
  @Column({ type: new DataType.STRING(64), allowNull: true })
  schedule?: string;

  @ApiModelProperty()
  @Column({ type: DataType.DATEONLY, allowNull: true })
  schedule_start_date?: string;

  @ApiModelProperty()
  @Column({ type: DataType.TIME, allowNull: true })
  schedule_start_time?: string;

  @ApiModelProperty()
  @Column({ type: DataType.DATEONLY, allowNull: true })
  schedule_finish_date?: string;

  @ApiModelProperty()
  @Column({ type: DataType.TIME, allowNull: true })
  schedule_finish_time?: string;

  // @ApiModelProperty()//todo with table
  // @Column({ type: DataType.INTEGER, allowNull: true })
  // group_id: number;
  //
  // @ApiModelProperty()//todo with table
  // @Column({ type: DataType.INTEGER, allowNull: true })
  // bonus_id: number;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.Model.Property.Type.BOOLEAN })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  display_for_logged_in: boolean;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.Model.Property.Type.BOOLEAN })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  display_for_not_logged_in: boolean;

  @ApiModelProperty()
  @Column({ type: DataType.TEXT, allowNull: true })
  custom_css: string;

  @ApiModelProperty({ type: 'string', format: 'date-time' })
  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @ApiModelProperty({ type: 'string', format: 'date-time' })
  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @ApiModelProperty({
    example: {
      template: {
        name: 'Promo page',
        type: 'promo',
      },
    },
  })
  @HasOne(() => StaticPageTemplate, { sourceKey: 'template_id', foreignKey: 'id', as: 'template' })
  template: StaticPageTemplate;

  @ApiModelProperty({
    example: [
      {
        cms_static_page_id: 90,
        language_id: 2,
        site_domain_id: 22,
        text: 'asd,lqwmkeq,mwk<div>12</div>',
        language: {
          name: 'Russian',
          short: 'ru',
        },
        site_domain: {
          url: 'www.babambet.com',
        },
      },
    ],
  })
  @HasMany(() => StaticPageValue, {
    sourceKey: 'id',
    foreignKey: 'cms_static_page_id',
    as: 'values',
    onDelete: 'cascade',
  })
  values: Array<StaticPageValue>;
}
