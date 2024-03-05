import { AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'bb_banner', freezeTableName: true, underscored: true })
export default class Banner extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: new DataType.STRING(64), allowNull: false })
  filename: string;

  @Column({ type: new DataType.STRING(32), allowNull: false })
  mime: string;

  @Column({ type: new DataType.STRING(64), allowNull: false })
  original_filename: string;

  @Column(DataType.DATE)
  from: Date;

  @Column(DataType.DATE)
  to: Date;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
