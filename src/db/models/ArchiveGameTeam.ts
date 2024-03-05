import { AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import sequelize from 'sequelize';

@Table({ timestamps: false, tableName: 'bb_archive_game_team', freezeTableName: true, underscored: true })
export default class ArchiveGameTeam extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  game_id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  team_id: number;

  @Column(DataType.DATEONLY)
  start_date: Date;

  @Default('undefined')
  @Column(new DataType.STRING(9))
  type: string;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;
}
