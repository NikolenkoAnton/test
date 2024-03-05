import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import sequelize, { BelongsToGetAssociationMixin } from 'sequelize';
import Outcome from './Outcome';

@Table({ timestamps: true, tableName: 'bb_template_view_outcome', freezeTableName: true, underscored: true })
export default class TemplateViewOutcome extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  template_view_column_id: string;

  @ForeignKey(() => Outcome)
  @Column({ type: DataType.INTEGER, allowNull: false, references: { model: 'betradar_outcome', key: 'id' } })
  outcome_id: string;

  @Column(new DataType.STRING(255))
  name: string;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Outcome, { targetKey: 'id', foreignKey: 'outcome_id', as: 'betradarOutcome' })
  getBetradarOutcome: BelongsToGetAssociationMixin<Outcome>;
}
