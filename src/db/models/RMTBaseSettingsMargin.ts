import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey } from 'sequelize-typescript';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { CustomTable } from './Base';
import RMTBaseSettings from './RMTBaseSettings';

@ApiModel()
@CustomTable('bb_rmt_base_settings_margin', false)
export default class RMTBaseSettingsMargin extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => RMTBaseSettings)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: 'RMTBaseSettings',
      key: 'id',
    },
  })
  rmt_base_settings_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: false })
  from: number;

  @ApiModelProperty()
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  to: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: true })
  margin_percent: number;
}
