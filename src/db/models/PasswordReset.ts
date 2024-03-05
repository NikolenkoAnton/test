import { Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'bb_password_reset', freezeTableName: true, underscored: true })
export default class PasswordReset extends Model {
  @Column({ type: new DataType.STRING(64), allowNull: false })
  email: string;

  @Column({ type: new DataType.STRING(64), allowNull: false })
  token: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
