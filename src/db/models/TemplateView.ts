import { AutoIncrement, Column, DataType, HasMany, HasOne, Model, PrimaryKey, Table } from 'sequelize-typescript';
import TemplateViewColumn from './TemplateViewColumn';
import { HasManyGetAssociationsMixin, HasOneGetAssociationMixin } from 'sequelize';
import TemplateViewMarket from './TemplateViewMarket';

@Table({ timestamps: false, tableName: 'bb_template_view', freezeTableName: true, underscored: true })
export default class TemplateView extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(new DataType.STRING(255))
  name: string;

  @HasMany(() => TemplateViewColumn, { sourceKey: 'id', foreignKey: 'template_view_id', as: 'templateViewColumns' })
  getTemplateViewColumns: HasManyGetAssociationsMixin<TemplateViewColumn>;
  @HasMany(() => TemplateViewMarket, { sourceKey: 'id', foreignKey: 'template_view_id', as: 'templateViewMarkets' })
  getTemplateViewMarkets: HasManyGetAssociationsMixin<TemplateViewMarket>;
}
