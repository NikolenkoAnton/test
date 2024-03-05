import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import User from './User';

@Table({ timestamps: true, tableName: 'bb_message', freezeTableName: true, underscored: true })
export default class Message extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_user', key: 'id' } })
  user_id: number;

  @Column({ type: new DataType.STRING(32), allowNull: false })
  status: string;

  @ForeignKey(() => Message)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_message', key: 'id' } })
  message_id: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  viewed: number;

  @Column({ type: new DataType.STRING(512), allowNull: false })
  text: string;

  @Default(0)
  @Column(new DataType.STRING(512))
  comment: string;

  @ForeignKey(() => Message)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_message', key: 'id' } })
  main_id: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @HasMany(() => Message, { sourceKey: 'id', foreignKey: 'message_id', as: 'messages' })
  getMessages: HasManyGetAssociationsMixin<Message>;
  @BelongsTo(() => Message, { targetKey: 'id', foreignKey: 'message_id', as: 'message' })
  getMessage: BelongsToGetAssociationMixin<Message>;
  @BelongsTo(() => Message, { targetKey: 'id', foreignKey: 'main_id', as: 'main' })
  getMain: BelongsToGetAssociationMixin<Message>;
  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' })
  getUser: BelongsToGetAssociationMixin<User>;
}
