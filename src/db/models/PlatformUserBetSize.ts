import { AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'bb_platform_user_bet_size', freezeTableName: true, underscored: true })
export default class PlatformUserBetSize extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: new DataType.INTEGER, allowNull: false })
  currency_id: number;

  @Column({ type: new DataType.INTEGER, allowNull: false })
  platform_user_id: number;

  @Column({ type: new DataType.DECIMAL(12, 6), allowNull: false })
  col1: string;

  @Column({ type: new DataType.DECIMAL(12, 6), allowNull: false })
  col2: Date;

  @Column({ type: new DataType.DECIMAL(12, 6), allowNull: false })
  col3: Date;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
