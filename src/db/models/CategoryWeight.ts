import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import sequelize from 'sequelize';

@Table({ timestamps: true, tableName: 'bb_category_weight', freezeTableName: true, underscored: true })
export default class CategoryWeight extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.INTEGER)
  category_id: number;

  @Column(DataType.INTEGER)
  sport_id: number;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  weight: number;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  updated_at: Date;
}
