import { AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'bb_file', freezeTableName: true, underscored: true })
export default class File extends Model {
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

  @Column(new DataType.STRING(256))
  en: string;

  @Column(new DataType.STRING(256))
  ru: string;

  @Column(new DataType.STRING(256))
  tr: string;

  @Column(new DataType.STRING(256))
  uk: string;

  @Column({ type: new DataType.STRING(64), allowNull: false })
  permissions: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
