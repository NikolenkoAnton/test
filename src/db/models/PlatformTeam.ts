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
import Platform from './Platform';
import Team from './Team';

@Table({ timestamps: true, tableName: 'bb_platform_team', freezeTableName: true, underscored: true })
export default class PlatformTeam extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Platform)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'platform_team_UNIQUE',
    references: { model: 'bb_platform', key: 'id' },
  })
  platform_id: number;

  @ForeignKey(() => Team)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'platform_team_UNIQUE',
    references: { model: 'bb_team', key: 'id' },
  })
  team_id: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  top: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  pool: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  profit: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  margin: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  quantity: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  pool_prematch_single: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  pool_prematch_multiple: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  pool_live_single: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  pool_live_multiple: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  profit_prematch_single: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  profit_prematch_multiple: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  profit_live_single: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  profit_live_multiple: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  quantity_prematch_single: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  quantity_prematch_multiple: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  quantity_live_single: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(13, 2), allowNull: false })
  quantity_live_multiple: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Platform, { targetKey: 'id', foreignKey: 'platform_id', as: 'platform' })
  getPlatform: BelongsToGetAssociationMixin<Platform>;
  @BelongsTo(() => Team, { targetKey: 'id', foreignKey: 'team_id', as: 'team' })
  getTeam: BelongsToGetAssociationMixin<Team>;
}
