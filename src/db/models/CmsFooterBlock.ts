import { col, fn } from 'sequelize';
import { BeforeCreate, BelongsTo, Column, DataType, Default, HasMany, HasOne, Scopes } from 'sequelize-typescript';
import { BaseModel, CustomTable } from './Base';
import CmsFooterGroup from './CmsFooterGroup';
import CmsFooterBlockType from './CmsFooterBlockType';
import CmsFooterLogo from './CmsFooterLogo';

@Scopes(() => ({
  sorted: {
    order: [['position', 'ASC']],
  },
}))
@CustomTable('bb_cms_footer_block')
export default class CmsFooterBlock extends BaseModel {
  @Column({ type: DataType.BIGINT, references: { model: 'bb_cms_footer_block_type', key: 'id' } })
  cms_footer_block_type_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Default(1)
  @Column({ type: DataType.INTEGER, allowNull: false })
  position: number;

  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  active: number;

  @BelongsTo(() => CmsFooterBlockType, {
    targetKey: 'id',
    foreignKey: 'cms_footer_block_type_id',
    as: 'type',
  })
  type: CmsFooterBlockType;

  @HasMany(() => CmsFooterGroup, {
    sourceKey: 'id',
    foreignKey: 'cms_footer_block_id',
    as: 'groups',
  })
  groups: Partial<CmsFooterGroup>[];

  @HasMany(() => CmsFooterLogo, {
    sourceKey: 'id',
    foreignKey: 'cms_footer_block_id',
    as: 'logo',
  })
  logos?: Partial<CmsFooterLogo>[];

  @BeforeCreate
  static async before(instance: CmsFooterBlock, options: any) {
    const {
      dataValues: { maxPosition },
    } = (await CmsFooterBlock.findOne({
      attributes: [[fn('MAX', col('position')), 'maxPosition']],
    })) as unknown as { dataValues: { maxPosition: number } };

    instance.position = maxPosition + 1;
  }
}
