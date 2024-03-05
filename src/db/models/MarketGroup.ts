import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin, HasManyGetAssociationsMixin, HasOneGetAssociationMixin } from 'sequelize';
import Sport from './Sport';
import TemplateMarketGroup from './TemplateMarketGroup';
import { TemplateViewMarket } from './index';

@Table({ timestamps: false, tableName: 'bb_market_group', freezeTableName: true, underscored: true })
export default class MarketGroup extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Sport)
  @Column({ type: DataType.BIGINT, allowNull: false, unique: 'type', references: { model: 'bb_sport', key: 'id' } })
  sport_id: number;

  @Column(DataType.INTEGER)
  provider_id: number;

  @Column(DataType.INTEGER)
  provider_market_group_id: number;

  @Column({ type: new DataType.STRING(255), allowNull: false, unique: 'type' })
  type: string;

  @Default(999)
  @Column({ type: DataType.INTEGER, allowNull: false })
  sort: number;

  @Default('All')
  @Column({ type: new DataType.STRING(255), allowNull: false })
  group: string;

  @BelongsTo(() => Sport, { targetKey: 'id', foreignKey: 'sport_id', as: 'sport' })
  getSport: BelongsToGetAssociationMixin<Sport>;

  @HasOne(() => TemplateViewMarket, { sourceKey: 'id', foreignKey: 'market_group_id', as: 'templateViewMarket' })
  getTemplateViewMarket: HasOneGetAssociationMixin<TemplateViewMarket>;
}
