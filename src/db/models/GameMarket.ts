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
import sequelize, { BelongsToGetAssociationMixin } from 'sequelize';
import TemplateMarketGroup from './TemplateMarketGroup';

@Table({ timestamps: true, tableName: 'bb_game_market', freezeTableName: true, underscored: true })
export default class GameMarket extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  game_id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  market_group_id: number;

  @ForeignKey(() => TemplateMarketGroup)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_template_market_group', key: 'id' } })
  template_market_group_id: number;

  @Default('FT')
  @Column({ type: new DataType.STRING(12), allowNull: false })
  period: string;

  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  enabled: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  suspended: number;

  @Column(new DataType.STRING(8))
  value: string;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  dynamic: string;

  @Column(DataType.BIGINT)
  max_win: string;

  @Column(DataType.BIGINT)
  stop_loss: string;

  @Column(DataType.SMALLINT)
  margin: number;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @BelongsTo(() => TemplateMarketGroup, {
    targetKey: 'id',
    foreignKey: 'template_market_group_id',
    as: 'templateMarketGroup',
  })
  getTemplateMarketGroup: BelongsToGetAssociationMixin<TemplateMarketGroup>;
}
