import { literal } from 'sequelize';
import { AutoIncrement, BelongsTo, Column, DataType, Default, Model, PrimaryKey } from 'sequelize-typescript';
import { CustomTable } from './Base';
import User from './User';

@CustomTable('bb_note', false)
export default class Note extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  path: string;

  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_user', key: 'id' } })
  creator_id: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  text: string;

  @Default(literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  created_at: Date;

  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'creator_id', as: 'user' })
  user: User;
}
