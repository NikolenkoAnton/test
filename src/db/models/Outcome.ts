import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import sequelize, { HasManyGetAssociationsMixin, HasOneGetAssociationMixin } from 'sequelize';
import BetOutcome from './BetOutcome';
import OutcomeStat from './OutcomeStat';
import { TemplateViewOutcome } from './index';

@Table({ timestamps: true, tableName: 'bb_outcome', freezeTableName: true, underscored: true })
export default class Outcome extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: new DataType.STRING(255), allowNull: false })
  type: string;

  @Column({ type: DataType.BIGINT, allowNull: false })
  market_group_id: number;

  @Column(new DataType.STRING(255))
  provider_outcome_id: string;

  @Column(DataType.INTEGER)
  provider_id: number;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  updated_at: Date;

  @HasMany(() => TemplateViewOutcome, { sourceKey: 'id', foreignKey: 'outcome_id', as: 'templateViewOutcomes' })
  getTemplateViewOutcomes: HasManyGetAssociationsMixin<TemplateViewOutcome>;
}
