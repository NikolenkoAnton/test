import { AutoIncrement, Column, DataType, Model, PrimaryKey } from 'sequelize-typescript';
import { CustomTable } from './Base';

@CustomTable('bb_platform_group', false)
export default class PlatformGroup extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  name: string;

  @Column(DataType.DATE)
  created_at: Date;
}
