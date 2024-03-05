import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { BelongsToGetAssociationMixin } from 'sequelize';
import Permission from './Permission';
import Role from './Role';

@Table({ timestamps: false, tableName: 'bb_permission_role', freezeTableName: true, underscored: true })
export default class PermissionRole extends Model {
  @PrimaryKey
  @ForeignKey(() => Permission)
  @Column({
    type: DataType.BIGINT,
    references: { model: 'bb_permission', key: 'id' },
    get: function (this: PermissionRole) {
      return parseInt(this.getDataValue('permission_id'));
    },
  })
  permission_id: number;

  @PrimaryKey
  @ForeignKey(() => Role)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_role', key: 'id' } })
  role_id: number;

  @BelongsTo(() => Permission, { targetKey: 'id', foreignKey: 'permission_id', as: 'permission' })
  getPermission: BelongsToGetAssociationMixin<Permission>;
  @BelongsTo(() => Role, { targetKey: 'id', foreignKey: 'role_id', as: 'role' })
  getRole: BelongsToGetAssociationMixin<Role>;
}
