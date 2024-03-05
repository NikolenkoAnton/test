import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import TemplateView from './TemplateView';
import { BelongsToGetAssociationMixin } from 'sequelize';

@Table({ timestamps: false, tableName: 'bb_template_view_column', freezeTableName: true, underscored: true })
export default class TemplateViewColumn extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: new DataType.STRING(255), allowNull: false })
  name: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  position: number;

  @ForeignKey(() => TemplateView)
  @Column({ type: DataType.INTEGER, allowNull: false, references: { model: 'bb_template_view', key: 'id' } })
  template_view_id: number;

  @BelongsTo(() => TemplateView, { targetKey: 'id', foreignKey: 'template_view_id', as: 'templateView' })
  getTemplateView: BelongsToGetAssociationMixin<TemplateView>;
}
