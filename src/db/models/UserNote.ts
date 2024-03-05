import { literal } from 'sequelize';
import { AutoIncrement, Column, DataType, Default, Model, PrimaryKey } from 'sequelize-typescript';
import { CustomTable } from './Base';

@CustomTable('bb_note_user', false)
export default class UserNote extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: 'bb_user',
      key: 'id',
    },
  })
  user_id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  note_path: string;

  @Default(literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  last_read_time: Date;
}
