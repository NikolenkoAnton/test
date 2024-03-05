import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import CmsImageItem from './CmsImageItem';
import { HasManyGetAssociationsMixin } from 'sequelize';

@Table({ timestamps: true, tableName: 'bb_cms_image', freezeTableName: true, underscored: true })
export default class CmsImage extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(new DataType.STRING(256))
  section: string;

  @Column(new DataType.STRING(256))
  name: string;

  @Column(new DataType.UUID())
  uuid: string;

  @Column(new DataType.STRING(256))
  extension: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @HasMany(() => CmsImageItem, { sourceKey: 'id', foreignKey: 'image_id', as: 'cmsImageItem' })
  getCmsImageItem: HasManyGetAssociationsMixin<CmsImageItem>;
}
