import { col, fn } from 'sequelize';
import {
  AutoIncrement,
  BeforeCreate,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Scopes,
} from 'sequelize-typescript';
import { ApiModelProperty } from 'swagger-express-ts';
import { CustomTable } from './Base';
import BurgerBlockItem from './BurgerBlockItem';
import BurgerBlockValue from './BurgerBlockValue';
import { BURGER_BLOCK_TYPES } from '../../helper/constants';

@Scopes(() => ({
  sorted: {
    order: [['position', 'ASC']],
  },
}))
@CustomTable('bb_cms_burger_block', false)
export default class BurgerBlock extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Default(1)
  @Column({ type: DataType.INTEGER, allowNull: false })
  position: number;

  @ApiModelProperty()
  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  active: number;

  @ApiModelProperty()
  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  can_has_items: number;

  @Column({ type: DataType.ENUM, values: Object.values(BURGER_BLOCK_TYPES) })
  type: BURGER_BLOCK_TYPES;

  @ApiModelProperty({
    model: 'BurgerBlockValue',
  })
  @HasMany(() => BurgerBlockValue, { sourceKey: 'id', foreignKey: 'burger_block_id', as: 'values' })
  values: Partial<BurgerBlockValue>[];

  @ApiModelProperty({
    model: 'BurgerBlockItem',
  })
  @HasMany(() => BurgerBlockItem, {
    sourceKey: 'id',
    foreignKey: 'burger_block_id',
    as: 'items',
  })
  items: Partial<BurgerBlockItem>[];

  @ApiModelProperty()
  @Column(DataType.VIRTUAL(DataType.STRING))
  get name(): string {
    return this.getDataValue('name');
  }

  set name(value: string) {
    this.setDataValue('name', value);
  }
  @BeforeCreate
  static async before(instance: BurgerBlock, options: any) {
    const {
      dataValues: { maxPosition },
    } = (await BurgerBlock.findOne({
      attributes: [[fn('MAX', col('position')), 'maxPosition']],
    })) as unknown as { dataValues: { maxPosition: number } };

    instance.position = maxPosition + 1;
  }
}
