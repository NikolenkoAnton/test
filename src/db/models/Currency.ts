import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { HasManyGetAssociationsMixin } from 'sequelize';
import Country from './Country';
import CurrencyBet from './CurrencyBet';
import CurrencyHistory from './CurrencyHistory';
import Payment from './Payment';
import ShiftOperation from './ShiftOperation';
import Transaction from './Transaction';

@Table({ timestamps: true, tableName: 'bb_currency', freezeTableName: true, underscored: true })
export default class Currency extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(new DataType.STRING(64))
  name: string;

  @Column(new DataType.STRING(64))
  name_plural: string;

  @Column({ type: new DataType.STRING(3), unique: 'code_UNIQUE' })
  code: string;

  @Column(new DataType.STRING(8))
  symbol: string;

  @Column(new DataType.STRING(16))
  symbol_native: string;

  @Column(DataType.SMALLINT)
  decimal_digits: number;

  @Column(new DataType.DECIMAL(4, 2))
  rounding: number;

  @Column(new DataType.DECIMAL(12, 7))
  value: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @HasMany(() => Country, { sourceKey: 'id', foreignKey: 'currency_id', as: 'countries' })
  getCountries: HasManyGetAssociationsMixin<Country>;
  @HasMany(() => CurrencyBet, { sourceKey: 'id', foreignKey: 'currency_id', as: 'currencyBets' })
  getCurrencyBets: HasManyGetAssociationsMixin<CurrencyBet>;
  @HasMany(() => CurrencyHistory, { sourceKey: 'id', foreignKey: 'currency_id', as: 'currencyHistories' })
  getCurrencyHistories: HasManyGetAssociationsMixin<CurrencyHistory>;
  @HasMany(() => Payment, { sourceKey: 'id', foreignKey: 'currency_id', as: 'payments' })
  getPayments: HasManyGetAssociationsMixin<Payment>;
  @HasMany(() => ShiftOperation, { sourceKey: 'id', foreignKey: 'currency_id', as: 'shiftOperations' })
  getShiftOperations: HasManyGetAssociationsMixin<ShiftOperation>;
  @HasMany(() => Transaction, { sourceKey: 'id', foreignKey: 'currency_id', as: 'transactions' })
  getTransactions: HasManyGetAssociationsMixin<Transaction>;
}
