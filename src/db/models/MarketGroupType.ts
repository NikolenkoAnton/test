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

@Table({ timestamps: true, tableName: 'bb_market_group_type', freezeTableName: true, underscored: true })
export default class MarketGroupType extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: new DataType.STRING(255), allowNull: false })
  en: string;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
