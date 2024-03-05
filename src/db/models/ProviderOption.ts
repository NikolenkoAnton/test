import {
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
import sequelize, { BelongsToGetAssociationMixin } from 'sequelize';
import Provider from './Provider';

@Table({ timestamps: true, tableName: 'bb_provider_option', freezeTableName: true, underscored: true })
export default class ProviderOption extends Model {
  @PrimaryKey
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => Provider)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_provider', key: 'id' } })
  provider_id: number;

  @Column({ type: new DataType.STRING(4), allowNull: false })
  item_type: string;

  @Column({ type: new DataType.STRING(64), allowNull: false })
  item_id: string;

  @Column(new DataType.STRING(32))
  item_hash: string;

  @Column({ type: new DataType.STRING(8), allowNull: false })
  value: string;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @Column(DataType.DATE)
  deleted_at: Date;

  @BelongsTo(() => Provider, { targetKey: 'id', foreignKey: 'provider_id', as: 'provider' })
  getProvider: BelongsToGetAssociationMixin<Provider>;
}
