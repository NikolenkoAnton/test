import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ timestamps: false, tableName: 'bb_debug', freezeTableName: true, underscored: true })
export default class Debug extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.BIGINT)
  bet_id: number;

  @Column(DataType.TEXT)
  type: string;

  @Column(DataType.TEXT)
  value: string;
}
