import { AutoIncrement, Column, CreatedAt, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';
import sequelize from 'sequelize';

@Table({ timestamps: false, tableName: 'bb_session_activity', freezeTableName: true, underscored: true })
export default class SessionActivity extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;
}
