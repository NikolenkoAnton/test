import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { BelongsToGetAssociationMixin } from 'sequelize';
import Role from './Role';
import User from './User';

@Table({ timestamps: false, tableName: 'bb_role_user', freezeTableName: true, underscored: true })
export default class RoleUser extends Model {
  @PrimaryKey
  @ForeignKey(() => Role)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_role', key: 'id' } })
  role_id: number;

  @PrimaryKey
  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_user', key: 'id' } })
  user_id: number;

  @BelongsTo(() => Role, { targetKey: 'id', foreignKey: 'role_id', as: 'role' })
  getRole: BelongsToGetAssociationMixin<Role>;
  role: Role;
  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' })
  getUser: BelongsToGetAssociationMixin<User>;
}
