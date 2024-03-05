import { Column, CreatedAt, DataType, HasMany, Model, UpdatedAt } from 'sequelize-typescript';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { CustomTable } from './Base';
import RMTBaseSettingsOdds from './RMTBaseSettingsOdds';
import RMTBaseSettingsMargin from './RMTBaseSettingsMargin';

@ApiModel()
@CustomTable('bb_rmt_base_settings', true)
export default class RMTBaseSettings extends Model {
  @ApiModelProperty({
    description: 'Basic risk per bet',
  })
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: false })
  basic_risk_per_bet: number;

  @ApiModelProperty({ description: 'Minimal_max_risk' })
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  minimal_max_risk_per_bet: number;

  @ApiModelProperty({ description: 'Maximal_max_risk' })
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  maximal_max_risk_per_bet: number;

  @ApiModelProperty({ description: 'Min_bet' })
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  min_bet_per_bet: number;

  @ApiModelProperty({ description: 'Max_bet' })
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  max_bet_per_bet: number;

  @ApiModelProperty({ description: 'Quantity of events with odds' })
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  odd_events_count: number;

  @ApiModelProperty({ description: 'Powers' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  odd_events_count_power: number;

  @ApiModelProperty({ description: 'MaxRisk for combos and systems' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  max_risk_combos_systems: number;

  @ApiModelProperty({ description: 'Basic delay (sec)' })
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: false })
  basic_delay: number;

  @ApiModelProperty({ description: 'Min_delay' })
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  min_delay: number;

  @ApiModelProperty({ description: 'Max_delay' })
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  max_delay: number;

  @ApiModelProperty({ description: 'Close market if k <' })
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  show_market_sum_limit: number;

  @ApiModelProperty({ description: 'Close event if no markets (sec)' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  show_market_time_limit: number;

  @ApiModelProperty({ description: 'Default MaxRisk per Event' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  basic_max_risk_per_event: number;

  @ApiModelProperty({ description: 'Default Minimal MaxRisk' })
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  minimal_max_risk_per_event: number;

  @ApiModelProperty({ description: 'Default Maximal MaxRisk' })
  @Column({ type: DataType.DECIMAL(13, 2), allowNull: true })
  maximal_max_risk_per_event: number;

  @ApiModelProperty({ description: 'Maximal Win' })
  @Column({ type: DataType.DECIMAL(12, 6), allowNull: false })
  max_win: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @ApiModelProperty({
    example: [
      {
        from: 1.3,
        to: 1.5,
        step: 0.2,
      },
      {
        from: 1.2,
        to: 1.1,
        step: 0.5,
      },
    ],
  })
  @HasMany(() => RMTBaseSettingsOdds, { sourceKey: 'id', foreignKey: 'rmt_base_settings_id', as: 'odds' })
  odds: RMTBaseSettingsOdds[];

  @ApiModelProperty({
    example: [
      {
        from: 1.41,
        to: 1.5,
        margin_percent: 1,
      },
      {
        from: 1.42,
        to: 1.53,
        margin_percent: 22,
      },
    ],
  })
  @HasMany(() => RMTBaseSettingsMargin, { sourceKey: 'id', foreignKey: 'rmt_base_settings_id', as: 'margins' })
  margins: RMTBaseSettingsMargin[];
}
