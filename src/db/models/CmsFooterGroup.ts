import { col, fn } from 'sequelize';
import { BeforeCreate, Column, DataType, Default, HasMany, Scopes } from 'sequelize-typescript';
import { BaseModel, CustomTable } from './Base';
import CmsFooterGroupElement from './CmsFooterGroupElement';
import CmsFooterGroupValue from './CmsFooterGroupValue';
import lodash from 'lodash';

const { pick } = lodash;
@Scopes(() => ({
  sorted: {
    order: [['position', 'ASC']],
  },
}))
@CustomTable('bb_cms_footer_group')
export default class CmsFooterGroup extends BaseModel {
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_cms_footer_block', key: 'id' } })
  cms_footer_block_id: number;

  @Default(1)
  @Column({ type: DataType.INTEGER, allowNull: false })
  position: number;

  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  active: number;

  @HasMany(() => CmsFooterGroupValue, { sourceKey: 'id', foreignKey: 'cms_footer_group_id', as: 'values' })
  values: Partial<CmsFooterGroupValue>[];

  @HasMany(() => CmsFooterGroupElement, {
    sourceKey: 'id',
    foreignKey: 'cms_footer_group_id',
    as: 'elements',
  })
  elements: CmsFooterGroupElement[];

  @BeforeCreate
  static async before(instance: CmsFooterGroup, options: any) {
    const {
      dataValues: { maxPosition },
    } = (await CmsFooterGroup.findOne({
      where: pick(instance, 'cms_footer_block_id'),
      attributes: [[fn('MAX', col('position')), 'maxPosition']],
    })) as unknown as { dataValues: { maxPosition: number } };

    instance.position = maxPosition + 1;
  }
}
