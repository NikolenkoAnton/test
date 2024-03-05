import {
  BelongsTo,
  Column,
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

@Table({ timestamps: true, tableName: 'bb_provider_data', freezeTableName: true, underscored: true })
export default class ProviderData extends Model {
  @PrimaryKey
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => Provider)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_provider', key: 'id' } })
  provider_id: number;

  @Column(new DataType.STRING(11))
  type: string;

  @Column(new DataType.STRING(160))
  name: string;

  @Column(DataType.BIGINT)
  last_user_id: number;

  @Column(DataType.DATE)
  deleted_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @BelongsTo(() => Provider, { targetKey: 'id', foreignKey: 'provider_id', as: 'provider' })
  getProvider: BelongsToGetAssociationMixin<Provider>;
}
