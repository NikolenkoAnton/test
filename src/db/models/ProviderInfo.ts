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
} from 'sequelize-typescript';
import sequelize, { BelongsToGetAssociationMixin } from 'sequelize';
import Provider from './Provider';
import Game from './Game';

@Table({ timestamps: false, tableName: 'bb_provider_info', freezeTableName: true, underscored: true })
export default class ProviderInfo extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Provider)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_provider', key: 'id' } })
  provider_id: number;

  @ForeignKey(() => Game)
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_game', key: 'id' } })
  game_id: number;

  @Column({ type: new DataType.STRING(12), allowNull: false })
  type: string;

  @Column(DataType.TEXT)
  value: string;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @BelongsTo(() => Provider, { targetKey: 'id', foreignKey: 'provider_id', as: 'provider' })
  getProvider: BelongsToGetAssociationMixin<Provider>;
  @BelongsTo(() => Game, { targetKey: 'id', foreignKey: 'game_id', as: 'game' })
  getGame: BelongsToGetAssociationMixin<Game>;
}
