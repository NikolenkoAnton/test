import { AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ timestamps: false, tableName: 'bb_user_classification', freezeTableName: true, underscored: true })
export default class UserClassification extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Default('0')
  @Column({ type: new DataType.STRING(255), allowNull: false })
  name: string;
}
