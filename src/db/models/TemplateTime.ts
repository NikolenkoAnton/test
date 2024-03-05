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
import Game from './Game';
import Template from './Template';

@Table({ timestamps: true, tableName: 'bb_template_time', freezeTableName: true, underscored: true })
export default class TemplateTime extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Template)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'template_time_template_id_hours_unique',
    references: { model: 'bb_template', key: 'id' },
  })
  template_id: number;

  @Column({ type: DataType.BIGINT, unique: 'template_time_template_id_hours_unique' })
  hours: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  max_win_single: number;

  @Default(100)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  max_win_multiple_percent: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  stop_loss: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  margin: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  max_bets: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  min_feeds: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Template, { targetKey: 'id', foreignKey: 'template_id', as: 'template' })
  getTemplate: BelongsToGetAssociationMixin<Template>;

  @HasMany(() => Game, { sourceKey: 'id', foreignKey: 'template_time_id', as: 'games' })
  getGames: HasManyGetAssociationsMixin<Game>;
}
