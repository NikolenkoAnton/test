import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin, Transaction } from 'sequelize';
import User from './User';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { USER_LOG_ACTIONS } from '../../helper/constants';
import { Request } from 'express';

@ApiModel({
  name: 'UserLog',
})
@Table({ timestamps: false, tableName: 'bb_user_log', freezeTableName: true, underscored: true })
export default class UserLog extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  @ApiModelProperty()
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_user', key: 'id' } })
  @ApiModelProperty()
  user_id: number;

  @Column({ type: new DataType.STRING(128), allowNull: false })
  @ApiModelProperty()
  action: string;

  @Column({ type: new DataType.STRING(24), allowNull: false })
  @ApiModelProperty()
  ip: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  @ApiModelProperty()
  url: string;

  @Column({ type: new DataType.STRING(36), allowNull: false })
  @ApiModelProperty()
  method: string;

  @Column(DataType.TEXT)
  @ApiModelProperty()
  params: string;

  @CreatedAt
  @Column(DataType.DATE)
  @ApiModelProperty()
  created_at: Date;

  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' })
  user: User;

  public static async add(action: USER_LOG_ACTIONS, req: Request, transaction: Transaction = null): Promise<UserLog> {
    const params = Object.assign(req.query, req.params, req.body);
    if (params.password) {
      params.password = '******';
    }

    return await UserLog.create(
      {
        user_id: req.user.id,
        action,
        ip: req.ip,
        url: req.originalUrl,
        method: req.method,
        params: JSON.stringify(params),
        created_at: Date.now(),
      },
      { transaction },
    );
  }
}
