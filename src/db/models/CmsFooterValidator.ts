import { AutoIncrement, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey } from 'sequelize-typescript';
import CmsFooterGroup from './CmsFooterGroup';
import { ApiModelProperty } from 'swagger-express-ts';
import { CustomTable } from './Base';
import { CmsFooterValidatorValue } from './index';

@CustomTable('bb_cms_footer_validator', false)
export default class CmsFooterValidator extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @ForeignKey(() => CmsFooterGroup)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: 'CmsFooterGroup', key: 'id' },
    onDelete: 'CASCADE',
  })
  cms_footer_block_id: number;

  @ApiModelProperty({
    model: 'CmsFooterValidatorValue',
    example: [
      {
        id: 15,
        active: 1,
        cms_footer_validator_id: 6,
        site_domain_id: 24,
        seals_id: 'asmdi12d1i23d111111111111---W',
        site_domain: {
          url: 'www.d1qw.asd',
        },
      },
      {
        id: 16,
        active: 0,
        cms_footer_validator_id: 6,
        site_domain_id: 26,
        seals_id: 'asmdi12d1i23qqqddddddddddd',
        site_domain: {
          url: 'www.d1qw.asqdq',
        },
      },
    ],
  })
  @HasMany(() => CmsFooterValidatorValue, { sourceKey: 'id', foreignKey: 'cms_footer_validator_id', as: 'values' })
  values: Array<CmsFooterValidatorValue>;
}
