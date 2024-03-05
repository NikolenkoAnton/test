import { AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import sequelize from 'sequelize';

@Table({ timestamps: false, tableName: 'bb_translate', freezeTableName: true, underscored: true })
export default class Translate extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: new DataType.STRING(255), allowNull: false })
  type: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  parent_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  translate_language_id: string;

  @Column({ type: new DataType.STRING(255), allowNull: false })
  text: string;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  @Column(DataType.DATE)
  updated_at: Date;
}
