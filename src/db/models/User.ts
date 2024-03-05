import { Exclude } from 'class-transformer';
import sequelize, { BelongsToGetAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import Bet from './Bet';
import BetCancelation from './BetCancelation';
import BetFavorite from './BetFavorite';
import Country from './Country';
import GameFavorite from './GameFavorite';
import GoldenRaceUser from './GoldenRaceUser';
import Message from './Message';
import Payment from './Payment';
import PlatformUser from './PlatformUser';
import Role from './Role';
import RoleUser from './RoleUser';
import Session from './Session';
import ShiftOperation from './ShiftOperation';
import Ticket from './Ticket';
import TicketExternals from './TicketExternals';
import TopEvents from './TopEvents';
import Transaction from './Transaction';
import UserFavorite from './UserFavorite';

@Table({ timestamps: true, tableName: 'bb_user', freezeTableName: true, underscored: true })
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Country)
  @Column({ type: DataType.BIGINT, references: { model: 'bb_country', key: 'id' } })
  country_id: number;

  @Column(DataType.BIGINT)
  item_id: number;

  @Column(DataType.INTEGER)
  code: number;

  @Column(new DataType.STRING(128))
  email: string;

  @Column({ type: new DataType.STRING(64), allowNull: false, unique: 'name' })
  name: string;

  @Column(new DataType.STRING(6))
  gender: string;

  @Column(DataType.DATE)
  birth: string;

  @Column(new DataType.STRING(10))
  phone: string;

  @Column(new DataType.STRING(8))
  locale: string;

  @Default('Europe/Kiev')
  @Column({ type: new DataType.STRING(64), allowNull: false })
  timezone: string;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  golden_race: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  active: number;

  @Column({ type: new DataType.STRING(256), allowNull: false })
  password: string;

  @Column({ type: new DataType.STRING(256), allowNull: true })
  forgot_pass: string;

  @Column(new DataType.STRING(256))
  remember_token: string;

  @Default(4)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  user_classification_id: string;

  @CreatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Default(sequelize.literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  updated_at: Date;

  @Exclude()
  @BelongsToMany(() => Role, () => RoleUser)
  roles: Role[];

  @BelongsTo(() => Country)
  getCountry: BelongsToGetAssociationMixin<Country>;

  @HasMany(() => Bet, { sourceKey: 'id', foreignKey: 'user_id', as: 'bets' })
  getBets: HasManyGetAssociationsMixin<Bet>;
  @HasMany(() => BetCancelation, { sourceKey: 'id', foreignKey: 'user_id', as: 'betCancelations' })
  getBetCancelations: HasManyGetAssociationsMixin<BetCancelation>;
  @HasMany(() => BetFavorite, { sourceKey: 'id', foreignKey: 'user_id', as: 'betFavorites' })
  getBetFavorites: HasManyGetAssociationsMixin<BetFavorite>;
  @HasMany(() => GameFavorite, { sourceKey: 'id', foreignKey: 'user_id', as: 'gameFavorites' })
  getGameFavorites: HasManyGetAssociationsMixin<GameFavorite>;
  @HasMany(() => GoldenRaceUser, { sourceKey: 'id', foreignKey: 'user_id', as: 'goldenRaceUsers' })
  getGoldenRaceUsers: HasManyGetAssociationsMixin<GoldenRaceUser>;
  @HasMany(() => Message, { sourceKey: 'id', foreignKey: 'user_id', as: 'messages' })
  getMessages: HasManyGetAssociationsMixin<Message>;
  @HasMany(() => Payment, { sourceKey: 'id', foreignKey: 'user_id', as: 'payments' })
  getPayments: HasManyGetAssociationsMixin<Payment>;
  @HasMany(() => PlatformUser, { sourceKey: 'id', foreignKey: 'user_id', as: 'platformUsers' })
  getPlatformUsers: HasManyGetAssociationsMixin<PlatformUser>;
  @HasMany(() => RoleUser, { sourceKey: 'id', foreignKey: 'user_id', as: 'roleUsers' })
  getRoleUsers: HasManyGetAssociationsMixin<RoleUser>;
  roleUsers: RoleUser[];
  @HasMany(() => Session, { sourceKey: 'id', foreignKey: 'user_id', as: 'sessions' })
  getSessions: HasManyGetAssociationsMixin<Session>;
  @HasMany(() => ShiftOperation, { sourceKey: 'id', foreignKey: 'user_id', as: 'shiftOperations' })
  getShiftOperations: HasManyGetAssociationsMixin<ShiftOperation>;
  @HasMany(() => Ticket, { sourceKey: 'id', foreignKey: 'user_id', as: 'tickets' })
  getTickets: HasManyGetAssociationsMixin<Ticket>;
  @HasMany(() => TicketExternals, { sourceKey: 'id', foreignKey: 'user_id', as: 'ticketExternals' })
  getTicketExternals: HasManyGetAssociationsMixin<TicketExternals>;
  @HasMany(() => TopEvents, { sourceKey: 'id', foreignKey: 'user_id', as: 'topEvents' })
  getTopEvents: HasManyGetAssociationsMixin<TopEvents>;
  @HasMany(() => Transaction, { sourceKey: 'id', foreignKey: 'user_id', as: 'transactions' })
  getTransactions: HasManyGetAssociationsMixin<Transaction>;
  @HasMany(() => UserFavorite, { sourceKey: 'id', foreignKey: 'user_id', as: 'userFavoritesWhereUser' })
  getUserFavoritesWhereUser: HasManyGetAssociationsMixin<UserFavorite>;
  @HasMany(() => UserFavorite, { sourceKey: 'id', foreignKey: 'player_id', as: 'userFavoritesWherePlayer' })
  getUserFavoritesWherePlayer: HasManyGetAssociationsMixin<UserFavorite>;
}
