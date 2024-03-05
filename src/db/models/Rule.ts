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

@Table({ timestamps: true, tableName: 'bb_rule', freezeTableName: true, underscored: true })
export default class Rule extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Default(0)
  @Column({ type: DataType.BIGINT, allowNull: false })
  rule_id: number;

  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  sort: number;

  @Column({ type: new DataType.STRING(3), allowNull: false })
  lang: string;

  @Column(DataType.TEXT)
  data: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;
}
