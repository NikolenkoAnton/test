import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ timestamps: false, tableName: 'bb_sport_softswiss', freezeTableName: true, underscored: true })
export default class SportSoftswiss extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  softswiss_id: number;

  @Column(DataType.INTEGER)
  betradar_id: number;

  @Column(DataType.STRING(255))
  type: string;

  @Column(DataType.INTEGER)
  priority: number;
}
