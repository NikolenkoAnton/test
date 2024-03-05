import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import GameMarket from './GameMarket';
import Template from './Template';
import MarketGroup from './MarketGroup';

@Table({ timestamps: true, tableName: 'bb_template_market_group', freezeTableName: true, underscored: true })
export default class TemplateMarketGroup extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Template)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'template_market_group_template_id_market_group_id_unique',
    references: { model: 'bb_template', key: 'id' },
  })
  template_id: number;

  @ForeignKey(() => MarketGroup)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'template_market_group_template_id_market_group_id_unique',
    references: { model: 'bb_market_group', key: 'id' },
  })
  market_group_id: number;

  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  enabled: number;

  @Column(DataType.SMALLINT)
  quantity: number;

  @Default(100)
  @Column({ type: DataType.INTEGER, allowNull: false })
  margin_modifier: number;

  @Default(100)
  @Column({ type: DataType.INTEGER, allowNull: false })
  max_win_modifier: number;

  @Default(100)
  @Column({ type: DataType.INTEGER, allowNull: false })
  stop_loss_modifier: number;

  @Default(100)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  min_feeds_modifier: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Template, { targetKey: 'id', foreignKey: 'template_id', as: 'template' })
  getTemplate: BelongsToGetAssociationMixin<Template>;
  @BelongsTo(() => MarketGroup, { targetKey: 'id', foreignKey: 'market_group_id', as: 'marketGroup' })
  getMarketGroup: BelongsToGetAssociationMixin<MarketGroup>;

  @HasMany(() => GameMarket, { sourceKey: 'id', foreignKey: 'template_market_group_id', as: 'gameMarkets' })
  getGameMarkets: HasManyGetAssociationsMixin<GameMarket>;
}
