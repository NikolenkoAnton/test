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
import MarketGroup from './MarketGroup';
import TemplateView from './TemplateView';

@Table({ timestamps: true, tableName: 'bb_template_view_market', freezeTableName: true, underscored: true })
export default class TemplateViewMarket extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => MarketGroup)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: 'market_group_id',
    references: { model: 'bb_market_group', key: 'id' },
  })
  market_group_id: string;

  @ForeignKey(() => TemplateView)
  @Column({ type: DataType.INTEGER, allowNull: false, references: { model: 'bb_template_view', key: 'id' } })
  template_view_id: string;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => MarketGroup, { targetKey: 'id', foreignKey: 'market_group_id', as: 'betradarMarketGroup' })
  getBetradarMarketGroup: BelongsToGetAssociationMixin<MarketGroup>;
  @BelongsTo(() => TemplateView, { targetKey: 'id', foreignKey: 'template_view_id', as: 'templateView' })
  getTemplateView: BelongsToGetAssociationMixin<TemplateView>;
}
