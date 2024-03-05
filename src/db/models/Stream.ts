import { AutoIncrement, Column, CreatedAt, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';
import sequelize from 'sequelize';

@Table({ timestamps: false, tableName: 'bb_stream', freezeTableName: true, underscored: true })
export default class Stream extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  item_id: number;

  @Column({ type: new DataType.STRING(32), allowNull: false })
  item_type: string;

  @Column({ type: new DataType.STRING(32), allowNull: false })
  action: string;

  @Column(new DataType.STRING(255))
  data: string;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;
}
