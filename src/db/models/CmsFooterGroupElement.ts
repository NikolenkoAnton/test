import { col, fn } from 'sequelize';
import { BeforeCreate, Column, DataType, Default, HasMany, Scopes } from 'sequelize-typescript';
import { BaseModel, CustomTable } from './Base';
import CmsFooterGroupElementValue from './CmsFooterGroupElementValue';
import lodash from 'lodash';
import { ApiModelProperty } from 'swagger-express-ts';

const { pick } = lodash;
@Scopes(() => ({
  awe: (arg: any) => ({}),
  sorted: {
    order: [['position', 'ASC']],
  },
}))
@CustomTable('bb_cms_footer_group_element')
export default class CmsFooterGroupElement extends BaseModel {
  @Column({ type: DataType.BIGINT, references: { model: 'bb_cms_footer_group', key: 'id' } })
  cms_footer_group_id: number;

  @Default(1)
  @Column({ type: DataType.INTEGER, allowNull: false })
  position: number;

  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  active: number;

  @ApiModelProperty()
  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  target_blank: number;

  @HasMany(() => CmsFooterGroupElementValue, {
    sourceKey: 'id',
    foreignKey: 'cms_footer_group_element_id',
    as: 'values',
  })
  values: CmsFooterGroupElementValue[];

  @BeforeCreate
  static async before(instance: CmsFooterGroupElement, options: any) {
    const {
      dataValues: { maxPosition },
    } = (await CmsFooterGroupElement.findOne({
      where: pick(instance, 'cms_footer_group_id'),
      attributes: [[fn('MAX', col('position')), 'maxPosition']],
    })) as unknown as { dataValues: { maxPosition: number } };

    instance.position = maxPosition + 1;
  }
}
