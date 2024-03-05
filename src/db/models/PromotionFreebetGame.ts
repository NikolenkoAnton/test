import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ timestamps: false, tableName: 'bb_promotion_freebet_game', freezeTableName: true, underscored: true })
export default class PromotionFreebetGame extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  promotion_freebet_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  game_id: number;
}
