import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'bb_promotion_freebet_status', freezeTableName: true, underscored: true })
export default class PromotionFreebetStatus extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  promotion_freebet_id: number;

  @Column({ type: new DataType.STRING(255), allowNull: false })
  status: string;
}
