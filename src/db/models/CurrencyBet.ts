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
  UpdatedAt,
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin } from 'sequelize';
import Currency from './Currency';

@Table({ timestamps: true, tableName: 'bb_currency_bet', freezeTableName: true, underscored: true })
export default class CurrencyBet extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Currency)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: 'currency_bet_UNIQUE',
    references: { model: 'bb_currency', key: 'id' },
  })
  currency_id: number;

  @Column({ type: new DataType.STRING(64), unique: 'currency_bet_UNIQUE' })
  name: string;

  @Column({ type: new DataType.STRING(8), unique: 'currency_bet_UNIQUE' })
  section: string;

  @Column(new DataType.DECIMAL(12, 2))
  value_default: string;

  @Column(new DataType.DECIMAL(12, 2))
  value_manual: string;

  @Column(new DataType.DECIMAL(12, 2))
  value: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Currency, { targetKey: 'id', foreignKey: 'currency_id', as: 'currency' })
  getCurrency: BelongsToGetAssociationMixin<Currency>;
}
