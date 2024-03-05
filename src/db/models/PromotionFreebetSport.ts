import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'bb_promotion_freebet_sport', freezeTableName: true, underscored: true })
export default class PromotionFreebetSport extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  promotion_freebet_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  sport_id: number;
}
