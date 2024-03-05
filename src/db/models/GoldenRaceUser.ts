import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin } from 'sequelize';
import User from './User';

@Table({ timestamps: true, tableName: 'bb_golden_race_user', freezeTableName: true, underscored: true })
export default class GoldenRaceUser extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_user', key: 'id' } })
  user_id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  entity_id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  target_id: number;

  @Column({ type: new DataType.STRING(255), allowNull: false })
  entity_name: string;

  @Column({ type: new DataType.STRING(255), allowNull: false })
  hardware_id: string;

  @Column({ type: new DataType.STRING(255), allowNull: false })
  pass_hash: string;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  browser_print: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' })
  getUser: BelongsToGetAssociationMixin<User>;
}
