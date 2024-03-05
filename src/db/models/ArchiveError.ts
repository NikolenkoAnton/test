import { Column, CreatedAt, DataType, Default, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import sequelize from 'sequelize';

@Table({ timestamps: true, tableName: 'bb_archive_error', freezeTableName: true, underscored: true })
export default class ArchiveError extends Model {
  @PrimaryKey
  @Default(0)
  @Column(DataType.BIGINT)
  id: number;

  @Column(DataType.BIGINT)
  game_id: number;

  @Column(DataType.BIGINT)
  provider_id: number;

  @Column({ type: new DataType.STRING(32), allowNull: false })
  type: string;

  @Column(new DataType.STRING(2048))
  text: string;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  updated_at: Date;
}
