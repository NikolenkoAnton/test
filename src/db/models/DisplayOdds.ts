import { AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'bb_display_odds', freezeTableName: true, underscored: true })
export default class DisplayOdds extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: new DataType.STRING(8), allowNull: false })
  section: string;

  @Column({ type: DataType.DECIMAL(6, 4), allowNull: false })
  min: string;

  @Column({ type: DataType.DECIMAL(6, 4), allowNull: false })
  max: string;

  @Column({ type: DataType.DECIMAL(6, 4), allowNull: false })
  step: string;

  @Column({ type: DataType.SMALLINT, allowNull: false })
  decimal: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
