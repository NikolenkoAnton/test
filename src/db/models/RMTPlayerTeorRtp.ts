import { AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, UpdatedAt } from 'sequelize-typescript';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { CustomTable } from './Base';

@ApiModel()
@CustomTable('bb_rmt_player_teor_rtp', true)
export default class RMTPlayerTeorRtp extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  @Column({ type: DataType.STRING(64), allowNull: false })
  group: number;

  @ApiModelProperty()
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  from: number;

  @ApiModelProperty()
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  to: number;

  @ApiModelProperty()
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  k: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
