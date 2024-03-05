import { BelongsToGetAssociationMixin } from 'sequelize';
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import Bet from './Bet';

@Table({ timestamps: false, tableName: 'bb_bet_attributes', freezeTableName: true, underscored: true })
export default class BetAttributes extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Bet)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: 'bb_bet', key: 'id' },
  })
  bet_id: number;

  @Column(new DataType.STRING(255))
  bonus_id?: string;

  @Column(new DataType.STRING(255))
  bonus_type?: string;

  @Column(new DataType.STRING(255))
  outcome_counts: string;

  @BelongsTo(() => Bet, { targetKey: 'id', foreignKey: 'bet_id', as: 'bet' })
  getBet: BelongsToGetAssociationMixin<Bet>;
}
