import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { HasOneGetAssociationMixin } from 'sequelize';
import CmsImage from './CmsImage';

@Table({ timestamps: true, tableName: 'bb_cms_image_item', freezeTableName: true, underscored: true })
export default class CmsImageItem extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(new DataType.UUID())
  uuid: string;

  @Column(new DataType.STRING(256))
  extension: string;

  @Column(new DataType.INTEGER())
  image_id: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @HasOne(() => CmsImage, { sourceKey: 'image_id', foreignKey: 'id', as: 'cmsImage' })
  getImage: HasOneGetAssociationMixin<CmsImage>;
}
