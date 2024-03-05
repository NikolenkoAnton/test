import {
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { HasManyGetAssociationsMixin } from 'sequelize';
import PermissionRole from './PermissionRole';
import RoleUser from './RoleUser';
import Permission from './Permission';
import User from './User';

@Table({ timestamps: true, tableName: 'bb_role', freezeTableName: true, underscored: true })
export default class Role extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: new DataType.STRING(32), allowNull: false, unique: 'name' })
  name: string;

  @Column({ type: new DataType.STRING(64) })
  display_name: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsToMany(() => User, () => RoleUser)
  users: User[];
  @BelongsToMany(() => Permission, () => PermissionRole)
  permissions: Permission[];
  @HasMany(() => PermissionRole, { sourceKey: 'id', foreignKey: 'role_id', as: 'permissionRoles' })
  getPermissionRoles: HasManyGetAssociationsMixin<PermissionRole>;
  @HasMany(() => RoleUser, { sourceKey: 'id', foreignKey: 'role_id', as: 'roleUsers' })
  getRoleUsers: HasManyGetAssociationsMixin<RoleUser>;
}
