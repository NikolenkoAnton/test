import lodash from 'lodash';
import { col, fn, HasManyGetAssociationsMixin } from 'sequelize';
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
  Table,
} from 'sequelize-typescript';
import { ApiModelProperty } from 'swagger-express-ts';
import { CustomTable } from './Base';
import BurgerBlockItemValue from './BurgerBlockItemValue';
const { pick } = lodash;

@Scopes(() => ({
  sorted: {
    order: [['position', 'ASC']],
  },
}))
@CustomTable('bb_cms_burger_block_item', false)
export default class BurgerBlockItem extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Column({ type: DataType.BIGINT, allowNull: false, references: { model: 'bb_burger_block', key: 'id' } })
  burger_block_id: number;

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
  target_blank: number;

  @ApiModelProperty({
    model: 'BurgerBlockItemValue',
  })
  @HasMany(() => BurgerBlockItemValue, { sourceKey: 'id', foreignKey: 'burger_block_item_id', as: 'values' })
  values: BurgerBlockItemValue[];

  @ApiModelProperty()
  @Column(DataType.VIRTUAL(DataType.STRING))
  get name(): string {
    return this.getDataValue('name');
  }

  set name(value: string) {
    this.setDataValue('name', value);
  }

  @BeforeCreate
  static async before(instance: BurgerBlockItem, options: any) {
    const {
      dataValues: { maxPosition },
    } = (await BurgerBlockItem.findOne({
      where: pick(instance, 'burger_block_id'),
      attributes: [[fn('MAX', col('position')), 'maxPosition']],
    })) as unknown as { dataValues: { maxPosition: number } };

    instance.position = maxPosition + 1;
  }
}
