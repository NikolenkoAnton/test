import { AutoIncrement, Column, CreatedAt, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';
import sequelize from 'sequelize';

@Table({ timestamps: false, tableName: 'bb_game_status', freezeTableName: true, underscored: true })
export default class GameStatus extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  count_game: number;

  @Column({ type: new DataType.STRING(50), allowNull: false })
  status: string;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;
}
