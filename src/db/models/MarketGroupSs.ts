import { AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import OutcomeSs from './OutcomeSs';
import { HasManyGetAssociationsMixin } from 'sequelize';

@Table({ timestamps: false, tableName: 'bb_market_group_ss', freezeTableName: true, underscored: true })
export default class MarketGroupSs extends Model {
  @Column(DataType.TEXT)
  additional: string;

  @Column(new DataType.STRING(255))
  name: string;

  @Column(DataType.INTEGER)
  ss_id: number;

  @Column(DataType.INTEGER)
  br_id: number;

  @HasMany(() => OutcomeSs, { sourceKey: 'ss_id', foreignKey: 'ss_market_id', as: 'outcomesSs' })
  outcomesSs: HasManyGetAssociationsMixin<OutcomeSs>;
}
