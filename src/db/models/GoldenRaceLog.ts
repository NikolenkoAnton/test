import { AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'bb_golden_race_log', freezeTableName: true, underscored: true })
export default class GoldenRaceLog extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.SMALLINT)
  type: number;

  @Column(DataType.SMALLINT)
  status: number;

  @Column(new DataType.STRING(255))
  url: string;

  @Column(DataType.TEXT)
  request: string;

  @Column(DataType.TEXT)
  response: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
