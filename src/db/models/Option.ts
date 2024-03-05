import { Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'bb_option', freezeTableName: true, underscored: true })
export default class Option extends Model {
  @PrimaryKey
  @Column({ type: new DataType.STRING(32), unique: 'name' })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  value: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
