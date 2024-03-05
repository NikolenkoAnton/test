import { HasManyGetAssociationsMixin } from 'sequelize';
import { CustomTable } from './Base';
import ComboBonusCondition from './ComboBonusCondition';
import ComboBonusValue from './ComboBonusValue';
import Sport from './Sport';
import User from './User';
import { COMBO_BONUS_STATUS_ENUM } from '../../controller/combo-bonus/constant';
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
} from 'sequelize-typescript';

@ApiModel({
  name: 'ComboBonus',
})
@CustomTable('bb_combo_bonus', false)
export default class ComboBonus extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ApiModelProperty()
  @Column({
    type: DataType.DECIMAL,
    allowNull: true,
  })
  min_odd?: number;

  @ApiModelProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'DRAFT',
  })
  status!: COMBO_BONUS_STATUS_ENUM;

  @ApiModelProperty()
  @Column({ type: DataType.DATEONLY })
  schedule_start_date: string;

  @ApiModelProperty()
  @Column({ type: DataType.TIME })
  schedule_start_time: string;

  @ApiModelProperty()
  @Column(DataType.DATEONLY)
  schedule_finish_date: string;

  @ApiModelProperty()
  @Column({ type: DataType.TIME })
  schedule_finish_time: string;

  @ApiModelProperty()
  @Column(DataType.STRING)
  schedule_type: string;

  @ApiModelProperty()
  @Column(DataType.ARRAY(DataType.INTEGER))
  schedule_days: number[];

  @ApiModelProperty()
  @Column(DataType.STRING)
  time_zone: string;

  @ApiModelProperty()
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  creator_id!: number;

  @ApiModelProperty()
  @ForeignKey(() => Sport)
  @Column({ type: DataType.INTEGER, allowNull: true })
  sport_id?: number;

  @ApiModelProperty()
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;

  @ApiModelProperty({
    model: 'DBSport',
  })
  @BelongsTo(() => Sport, { foreignKey: 'sport_id', as: 'sport' })
  sport?: Sport;

  @ApiModelProperty({ model: 'BaseResponse' })
  @BelongsTo(() => User, { foreignKey: 'creator_id', as: 'creator' })
  creator: User;

  @ApiModelProperty({ model: 'ComboBonusCondition', type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY })
  @HasMany(() => ComboBonusCondition, { sourceKey: 'id', foreignKey: 'combo_bonus_id', as: 'conditions' })
  conditions: ComboBonusCondition[];

  @ApiModelProperty({ model: 'ComboBonusValue', type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY })
  @HasMany(() => ComboBonusValue, { sourceKey: 'id', foreignKey: 'combo_bonus_id', as: 'values' })
  values: ComboBonusValue[];

  @ApiModelProperty()
  @Column(DataType.VIRTUAL(DataType.STRING))
  get name(): string {
    return this.getDataValue('name');
  }

  set name(value: string) {
    this.setDataValue('name', value);
  }
}
