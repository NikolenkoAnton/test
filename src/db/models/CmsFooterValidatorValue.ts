import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
} from 'sequelize-typescript';
import SiteDomain from './SiteDomain';
import { ApiModelProperty } from 'swagger-express-ts';
import { CustomTable } from './Base';
import CmsFooterValidator from './CmsFooterValidator';

@CustomTable('bb_cms_footer_validator_value', false)
export default class CmsFooterValidatorValue extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  active: number;

  @ApiModelProperty()
  @ForeignKey(() => CmsFooterValidator)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: 'CmsFooterValidator', key: 'id' },
    onDelete: 'CASCADE',
  })
  cms_footer_validator_id: number;

  @ApiModelProperty()
  @ForeignKey(() => SiteDomain)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: 'SiteDomain', key: 'id' },
    onDelete: 'CASCADE',
  })
  site_domain_id: number;

  @ApiModelProperty()
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  seals_id: string;

  @ApiModelProperty()
  @BelongsTo(() => SiteDomain, { targetKey: 'id', foreignKey: 'site_domain_id', as: 'site_domain' })
  site_domain: SiteDomain;
}
