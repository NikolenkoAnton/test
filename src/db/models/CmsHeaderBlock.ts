import { CMS_HEADER_BLOCK_TYPES_ENUM } from '../../helper/constants';
import { col, fn } from 'sequelize';
import { BeforeCreate, Column, DataType, Default, HasMany, Scopes } from 'sequelize-typescript';
import { BaseModel, CustomTable } from './Base';
import CmsHeaderBlockValue from './CmsHeaderBlockValue';
import { values } from 'lodash';
import { ApiModelProperty } from 'swagger-express-ts';

@Scopes(() => ({
  sorted: {
    order: [['position', 'ASC']],
  },
}))
@CustomTable('bb_cms_header_block')
export default class CmsHeaderBlock extends BaseModel {
  @Default(1)
  @Column({ type: DataType.INTEGER, allowNull: false })
  position: number;

  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  active: number;

  @HasMany(() => CmsHeaderBlockValue, { sourceKey: 'id', foreignKey: 'cms_header_block_id', as: 'values' })
  values: Partial<CmsHeaderBlockValue>[];

  @Column(DataType.STRING)
  url: string;

  @ApiModelProperty()
  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  target_blank: number;

  @Column({ type: DataType.ENUM, values: values(CMS_HEADER_BLOCK_TYPES_ENUM) })
  type: CMS_HEADER_BLOCK_TYPES_ENUM;

  @Column(DataType.VIRTUAL(DataType.STRING))
  get title(): string {
    return this.getDataValue('title');
  }

  set title(value: string) {
    this.setDataValue('title', value);
  }

  @BeforeCreate
  static async before(instance: CmsHeaderBlock, options: any) {
    const {
      dataValues: { maxPosition },
    } = (await CmsHeaderBlock.findOne({
      attributes: [[fn('MAX', col('position')), 'maxPosition']],
    })) as unknown as { dataValues: { maxPosition: number } };

    instance.position = maxPosition + 1;
  }
}
