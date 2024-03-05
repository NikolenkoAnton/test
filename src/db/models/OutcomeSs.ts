import { Column, DataType, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Table } from 'sequelize-typescript';
import BetOutcome from './BetOutcome';
import { HasManyGetAssociationsMixin, HasOneGetAssociationMixin } from 'sequelize';
import MarketGroupSs from './MarketGroupSs';

@Table({ timestamps: false, tableName: 'bb_outcome_ss', freezeTableName: true, underscored: true })
export default class OutcomeSs extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  ss_id: number;

  @ForeignKey(() => MarketGroupSs)
  @Column(DataType.INTEGER)
  ss_market_id: number;

  @Column(new DataType.STRING(255))
  br_id: string;

  @Column(new DataType.STRING(255))
  name: string;

  @HasOne(() => MarketGroupSs, { sourceKey: 'ss_market_id', foreignKey: 'ss_id', as: 'marketGroupSs' })
  marketGroupSs: HasOneGetAssociationMixin<MarketGroupSs>;
  @HasMany(() => BetOutcome, { sourceKey: 'ss_id', foreignKey: 'outcome_id', as: 'betOutcomes' })
  betOutcomes: HasManyGetAssociationsMixin<BetOutcome>;
}
