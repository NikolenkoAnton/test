import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey } from 'sequelize-typescript';
import { CustomTable } from './Base';
import PlatformGroup from './PlatformGroup'; // Импорт класса PlatformGroup
import PlatformUser from './PlatformUser'; // Предполагается, что класс PlatformUser уже существует

@CustomTable('bb_platform_user_group', false)
export default class PlatformUserGroup extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => PlatformUser)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: { model: 'bb_platform_user', key: 'user_id' }, // Убедитесь, что ключ правильный
  })
  user_id: number;

  @ForeignKey(() => PlatformGroup)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: { model: 'bb_platform_group', key: 'id' },
  })
  group_id: number;

  @Column(DataType.DATE)
  created_at: Date;
}
