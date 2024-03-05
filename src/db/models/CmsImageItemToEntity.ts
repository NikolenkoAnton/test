import {
  AutoIncrement,
  BeforeCreate,
  Column,
  DataType,
  Default,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import CmsImageItem from './CmsImageItem';
import { col, fn, HasManyGetAssociationsMixin } from 'sequelize';
import { ApiModelProperty } from 'swagger-express-ts';
import lodash from 'lodash';
const { pick } = lodash;

@Table({ timestamps: false, tableName: 'bb_cms_image_item_to_entity', freezeTableName: true, underscored: true })
export default class CmsImageItemToEntity extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  entity_id: number;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: true })
  cms_image_item_id: number;

  @Column({ type: DataType.STRING(32), allowNull: false })
  entity_type: string;

  @ApiModelProperty()
  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  position: number;

  @HasOne(() => CmsImageItem, { sourceKey: 'cms_image_item_id', foreignKey: 'id', as: 'cmsImageItem' })
  getCmsImageItem: HasManyGetAssociationsMixin<CmsImageItem>;

  @BeforeCreate
  static async before(instance: CmsImageItemToEntity, options: any) {
    const {
      dataValues: { maxPosition },
    } = (await CmsImageItemToEntity.findOne({
      where: pick(instance, 'entity_id'),
      attributes: [[fn('MAX', col('position')), 'maxPosition']],
    })) as unknown as { dataValues: { maxPosition: number } };

    instance.position = maxPosition + 1;
  }
}
