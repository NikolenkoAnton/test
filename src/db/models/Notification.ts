import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import sequelize from 'sequelize';

@Table({ timestamps: true, tableName: 'bb_notification', freezeTableName: true, underscored: true })
export default class Notification extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.DATE)
  from: Date;

  @Column(DataType.DATE)
  to: Date;

  @Column(new DataType.STRING(5))
  item_type: string;

  @Column(DataType.INTEGER)
  item_id: number;

  @Column(DataType.TEXT)
  text: string;

  @Column(new DataType.STRING(512))
  domains: string;

  @Default('info')
  @Column({ type: new DataType.STRING(7), allowNull: false })
  type: string;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
