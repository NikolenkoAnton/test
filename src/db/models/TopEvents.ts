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
  UpdatedAt,
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin } from 'sequelize';
import User from './User';

@Table({ timestamps: true, tableName: 'bb_top_events', freezeTableName: true, underscored: true })
export default class TopEvents extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_user', key: 'id' } })
  user_id: number;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @Column({ type: new DataType.STRING(15), allowNull: false })
  screen: string;

  @Column({ type: new DataType.STRING(255), allowNull: false })
  event: string;

  @Column({ type: new DataType.STRING(255), allowNull: false })
  channel: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' })
  getUser: BelongsToGetAssociationMixin<User>;
}
