import { AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, UpdatedAt } from 'sequelize-typescript';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { CustomTable } from './Base';

@ApiModel()
@CustomTable('bb_rmt_player', true)
export default class RMTPlayer extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  k_from: number;

  @ApiModelProperty()
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  k_to: number;

  @ApiModelProperty()
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  nz_from: number;

  @ApiModelProperty()
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  nz_to: number;

  @ApiModelProperty()
  @Column({ type: DataType.STRING(32), allowNull: false })
  section: string;

  @ApiModelProperty()
  @Column({ type: DataType.STRING(32), allowNull: false })
  group: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
