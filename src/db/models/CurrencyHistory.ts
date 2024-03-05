import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin } from 'sequelize';
import Currency from './Currency';

@Table({ timestamps: false, tableName: 'bb_currency_history', freezeTableName: true, underscored: true })
export default class CurrencyHistory extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Currency)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'currency_history_UNIQUE',
    references: { model: 'bb_currency', key: 'id' },
  })
  currency_id: number;

  @Column({ type: DataType.DATEONLY, allowNull: false, unique: 'currency_history_UNIQUE' })
  date: Date;

  @Column(new DataType.DECIMAL(12, 7))
  value: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @BelongsTo(() => Currency, { targetKey: 'id', foreignKey: 'currency_id', as: 'currency' })
  getCurrency: BelongsToGetAssociationMixin<Currency>;
}
