import sequelize, {
  BelongsToGetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasOneGetAssociationMixin,
  Op,
  literal,
} from 'sequelize';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import BetAttributes from './BetAttributes';
import BetCancelation from './BetCancelation';
import BetFavorite from './BetFavorite';
import BetOutcome from './BetOutcome';
import PlatformUser from './PlatformUser';
import Ticket from './Ticket';
import { BET_RESULTS_ENUM, BET_TYPES_ENUM } from '../../helper/bet_constants';
import bigDecimal from 'js-big-decimal';
// import Literal from 'sequelize/types';

@Scopes(() => ({
  withEur: {
    attributes: {
      include: [
        [sequelize.literal('stake/currency_value'), 'stake_eur'],
        [sequelize.literal('COALESCE(win,0)/currency_value'), 'win_eur'],
      ],
    },
  },
  onlyCalculated: {
    where: { result: { [Op.and]: [{ [Op.not]: null }] } },
  },
}))
@Table({ timestamps: true, tableName: 'bb_bet', freezeTableName: true, underscored: true })
export default class Bet extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: new DataType.STRING(36), allowNull: false })
  uuid: string;

  @ForeignKey(() => PlatformUser)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_platform_user', key: 'id' } })
  user_id: number;

  @ForeignKey(() => Ticket)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_ticket', key: 'id' } })
  ticket_id: number;

  @Column({ type: DataType.BIGINT })
  bet_slip_id: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  closed: number;

  @Column(new DataType.DECIMAL(12, 6))
  cashout_amount: number;

  @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: 777 })
  code: number;

  @Column(new DataType.STRING(13))
  number: string;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  pending: number;

  @Column(new DataType.DECIMAL(12, 6))
  stake: number;

  @Column(DataType.SMALLINT)
  freebet: number;

  @Column(new DataType.DECIMAL(12, 6))
  stake_real: number;

  @Column(new DataType.DECIMAL(12, 6))
  stake_bonus: number;

  @Default(0.0)
  @Column({ type: new DataType.DECIMAL(12, 3), allowNull: false })
  odds: number;

  @Column(new DataType.DECIMAL(12, 6))
  win: number;

  @Column(new DataType.DECIMAL(12, 6))
  possible_win: number;

  @Column(new DataType.DECIMAL(12, 6))
  current_possible_win: number;

  @Column(DataType.SMALLINT())
  system: number;

  @Default(BET_TYPES_ENUM.SINGLE)
  @Column({ type: new DataType.STRING(7), allowNull: false })
  type: string;

  @Column({ type: new DataType.STRING(3) })
  currency_code: string;

  @Column({ type: new DataType.DECIMAL(12, 7) })
  currency_value: number;

  @Column(DataType.TEXT)
  comment: string;

  @Column({ type: new DataType.STRING(11) })
  result: BET_RESULTS_ENUM;

  @Default(0)
  @Column(DataType.SMALLINT)
  proceed_attempts: number;

  @Column(DataType.DATE)
  proceed_after: Date;

  @Column(DataType.DATE)
  resulted_at: Date;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @HasOne(() => PlatformUser, { sourceKey: 'user_id', foreignKey: 'id', as: 'platformUser' })
  getUser: HasOneGetAssociationMixin<PlatformUser>;
  @BelongsTo(() => Ticket, { targetKey: 'id', foreignKey: 'ticket_id', as: 'ticket' })
  getTicket: BelongsToGetAssociationMixin<Ticket>;

  @HasOne(() => BetAttributes, { sourceKey: 'id', foreignKey: 'bet_id', as: 'betAttributes' })
  getBetAttributes: HasOneGetAssociationMixin<BetAttributes>;

  @HasOne(() => BetCancelation, { sourceKey: 'id', foreignKey: 'bet_id', as: 'betCancelation' })
  getBetCancelation: HasOneGetAssociationMixin<BetCancelation>;
  @HasOne(() => BetFavorite, { sourceKey: 'id', foreignKey: 'bet_id', as: 'betFavorite' })
  getBetFavorite: HasOneGetAssociationMixin<BetFavorite>;
  @HasMany(() => BetOutcome, { sourceKey: 'id', foreignKey: 'bet_id', as: 'betOutcomes' })
  getBetOutcomes: HasManyGetAssociationsMixin<BetOutcome>;

  @Column(DataType.VIRTUAL(new DataType.DECIMAL(12, 2)))
  get risk_op(): number {
    // ? Используем bigDecimal для деления, чтобы обеспечить высокую точность в вычислениях с плавающей точкой
    const possibleWinEur = bigDecimal.divide(
      this.getDataValue('possible_win'),
      this.getDataValue('currency_value') || 1,
      6,
    );

    const stakeEur = bigDecimal.divide(this.getDataValue('stake'), this.getDataValue('currency_value') || 1, 6);

    /* 
      ? Используем bigDecimal для вычитания, чтобы избежать ошибок округления при работе с числами с плавающей точкой
      ! Пример: 
      ? Без bigDecimal: 0.00013 - 0.0001 = 0.000029999999999999984
      ? С bigDecimal: 0.00013 - 0.0001 = 0.00003
    
     */
    const riskEur = bigDecimal.subtract(possibleWinEur, stakeEur);

    return Number(riskEur);
  }

  @Column(DataType.VIRTUAL(new DataType.DECIMAL(12, 2)))
  get risk(): number {
    const risk = bigDecimal.subtract(this.getDataValue('possible_win'), this.getDataValue('stake'));

    return Number(risk);
  }

  @Column(DataType.VIRTUAL(new DataType.DECIMAL(12, 2)))
  get profit(): number {
    return this.getDataValue('profit');
  }

  @Column(DataType.VIRTUAL(new DataType.DECIMAL(12, 2)))
  get bet_sum(): number {
    return this.getDataValue('bet_sum');
  }

  @Column(DataType.VIRTUAL(new DataType.DECIMAL(12, 2)))
  get bet_counts(): number {
    return this.getDataValue('bet_counts');
  }

  @Column(DataType.VIRTUAL(new DataType.DECIMAL(12, 2)))
  get rtp(): number {
    return this.getDataValue('rtp');
  }
}
