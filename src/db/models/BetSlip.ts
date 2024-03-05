import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { BelongsToGetAssociationMixin, HasOneGetAssociationMixin } from 'sequelize';
import BetSlipOutcome from './BetSlipOutcome';
import Session from './Session';

@Table({ timestamps: true, tableName: 'bb_bet_slip', freezeTableName: true, underscored: true })
export default class BetSlip extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Session)
  @Column({
    type: new DataType.STRING(64),
    unique: 'bet_slip_session_id_unique',
    references: { model: 'bb_session', key: 'id' },
  })
  session_id: string;

  @Column(DataType.BIGINT)
  cashier_id: number;

  @Column({ type: DataType.BIGINT, unique: 'bet_slip_code_unique' })
  code: number;

  @Column(DataType.DECIMAL(12, 2))
  stake: number;

  @Column(DataType.SMALLINT)
  freebet: number;

  @Default('ordinar')
  @Column({ type: new DataType.STRING(7), allowNull: false })
  type: string;

  @Column(DataType.SMALLINT)
  system: number;

  @Default('always_ask')
  @Column({ type: new DataType.STRING(14), allowNull: false })
  mode: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Session, { targetKey: 'id', foreignKey: 'session_id', as: 'session' })
  getSession: BelongsToGetAssociationMixin<Session>;

  @HasOne(() => BetSlipOutcome, { sourceKey: 'id', foreignKey: 'bet_slip_id', as: 'betSlipOutcome' })
  getBetSlipOutcome: HasOneGetAssociationMixin<BetSlipOutcome>;
}
