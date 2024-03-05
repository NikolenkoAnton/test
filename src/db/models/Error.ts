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
import Provider from './Provider';

@Table({ timestamps: true, tableName: 'bb_error', freezeTableName: true, underscored: true })
export default class Error extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.BIGINT, allowNull: false, unique: 'error_unique' })
  game_id: number;

  @ForeignKey(() => Provider)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_provider', key: 'id' } })
  provider_id: number;

  @Column({ type: new DataType.STRING(32), allowNull: false, unique: 'error_unique' })
  type: string;

  @Column({ type: new DataType.STRING(2048), allowNull: false, unique: 'error_unique' })
  text: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Provider, { targetKey: 'id', foreignKey: 'provider_id', as: 'provider' })
  getProvider: BelongsToGetAssociationMixin<Provider>;
}
