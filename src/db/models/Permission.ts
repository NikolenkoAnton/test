import {
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import sequelize, { HasManyGetAssociationsMixin } from 'sequelize';
import PermissionRole from './PermissionRole';
import Role from './Role';

@Table({ timestamps: false, tableName: 'bb_permission', freezeTableName: true, underscored: true })
export default class Permission extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: new DataType.STRING(64), allowNull: false, unique: 'name' })
  name: string;

  @Column({ type: new DataType.STRING(64), allowNull: false, unique: 'display_name' })
  display_name: string;

  @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: 0 })
  is_route: string;

  @Column(new DataType.STRING(64))
  path?: string;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @BelongsToMany(() => Role, () => PermissionRole)
  roles: Role[];
  @HasMany(() => PermissionRole, { sourceKey: 'id', foreignKey: 'permission_id', as: 'permissionRoles' })
  getPermissionRoles: HasManyGetAssociationsMixin<PermissionRole>;
}
