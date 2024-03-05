import {
  AutoIncrement,
  BeforeCreate,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import CmsFooterGroup from './CmsFooterGroup';
import { ApiModelProperty } from 'swagger-express-ts';
import CmsFooterLogoValue from './CmsFooterLogoValue';
import { col, fn } from 'sequelize';

@Table({ timestamps: false, tableName: 'bb_cms_footer_logo', freezeTableName: true, underscored: true })
export default class CmsFooterLogo extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Column({ type: DataType.TEXT, allowNull: false })
  title: string;

  @ApiModelProperty()
  @ForeignKey(() => CmsFooterGroup)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: 'CmsFooterGroup', key: 'id' },
    onDelete: 'CASCADE',
  })
  cms_footer_block_id: number;

  @ApiModelProperty()
  @Default(1)
  @Column({ type: DataType.INTEGER, allowNull: false })
  position: number;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  active: number;

  @ApiModelProperty({
    model: 'CmsFooterLogoValue',
  })
  @HasMany(() => CmsFooterLogoValue, { sourceKey: 'id', foreignKey: 'cms_footer_logo_id', as: 'values' })
  values: Array<CmsFooterLogoValue>;

  @BeforeCreate
  static async before(instance: CmsFooterLogo, options: any) {
    const {
      dataValues: { maxPosition },
    } = (await CmsFooterLogo.findOne({
      where: { cms_footer_block_id: instance.cms_footer_block_id },
      attributes: [[fn('MAX', col('position')), 'maxPosition']],
    })) as unknown as { dataValues: { maxPosition: number } };

    instance.position = maxPosition + 1;
  }
}
