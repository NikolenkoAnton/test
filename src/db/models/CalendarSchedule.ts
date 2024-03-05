import { Model, Table, Column, DataType, AutoIncrement, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'bb_calendar_schedule',
  timestamps: false,
})
export default class CalendarSchedule extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.DATE,
  })
  start_time: Date;

  @Column({
    type: DataType.DATE,
  })
  end_time: Date;

  @Column({
    type: DataType.INTEGER,
  })
  entity_id: number;

  @Column({
    type: DataType.STRING(255),
  })
  entity_type: string;
}
