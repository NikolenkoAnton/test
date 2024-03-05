import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { GameTeam } from './index';
import { CustomTable } from './Base';

@ApiModel()
@CustomTable('bb_rmt_team', false)
export default class RMTTeam extends Model {
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
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  team_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.DECIMAL(4, 2), allowNull: true })
  max_risk_bet: number;

  @ApiModelProperty()
  @Column({ type: DataType.DECIMAL(4, 2), allowNull: true })
  delay: number;

  @ApiModelProperty()
  @Column({ type: DataType.DECIMAL(4, 2), allowNull: true })
  max_risk_player_event: number;

  @ApiModelProperty()
  @Column({ type: DataType.DECIMAL(4, 2), allowNull: true })
  margin: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
