import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'bb_promotion_freebet_type', freezeTableName: true, underscored: true })
export default class PromotionFreebetType extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  promotion_freebet_id: number;

  @Column({ type: new DataType.STRING(255), allowNull: false })
  type: string;
}
