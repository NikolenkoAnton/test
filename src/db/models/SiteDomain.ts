import {
  AutoIncrement,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import SiteDomainLogo from './SiteDomainLogo';

@ApiModel({
  name: 'SiteDomain',
})
@Scopes(() => ({
  onlyActive: {
    where: { active: 1 },
  },
  main: {
    attributes: ['id', 'name', 'url'],
  },
}))
@Table({ timestamps: false, tableName: 'bb_site_domain', freezeTableName: true, underscored: true })
export default class SiteDomain extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Column({ type: new DataType.TEXT(), allowNull: true })
  name: string;

  @ApiModelProperty()
  @Column({ type: new DataType.STRING(256), allowNull: false, unique: 'url' })
  url: string;

  @ApiModelProperty()
  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  active: number;

  @ApiModelProperty()
  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  big_logo_active: number;

  @ApiModelProperty()
  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  small_logo_active: number;

  @ApiModelProperty()
  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  favicon_active: number;

  @ApiModelProperty()
  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  is_default: number;

  @HasMany(() => SiteDomainLogo, { sourceKey: 'id', foreignKey: 'site_domain_id', as: 'logos' })
  logos: SiteDomainLogo[];

  @ApiModelProperty({
    example: {
      type: 'big_logo',
      id: 20,
      cmsImageItem: {
        uuid: 'f7c32dd4-7604-45e5-b864-96e350ed1865',
        extension: 'png',
        cmsImage: {
          name: 'Original-image-256x256-pixels.png',
        },
      },
    },
  })
  get big_logo_image(): SiteDomainLogo {
    return this.getDataValue('big_logo_image');
  }

  set big_logo_image(value: SiteDomainLogo) {
    this.setDataValue('big_logo_image', value);
  }

  @ApiModelProperty({
    example: {
      type: 'small_logo',
      id: 21,
      cmsImageItem: {
        uuid: 'a90ad398-dddc-4b4d-8905-e6cbffcbcec4',
        extension: 'jpg',
        cmsImage: {
          name: 'photo_2023-02-03_12-44-58.jpg',
        },
      },
    },
  })
  get small_logo_image(): SiteDomainLogo {
    return this.getDataValue('small_logo_image');
  }

  set small_logo_image(value: SiteDomainLogo) {
    this.setDataValue('small_logo_image', value);
  }

  @ApiModelProperty({
    example: {
      type: 'favicon',
      id: 22,
      cmsImageItem: {
        uuid: 'b27034fc-a03c-4202-a451-a9cce7f9afc3',
        extension: 'png',
        cmsImage: { 
          name: 'Original-image-256x256-pixels.png',
        },
      },
    },
  })
  get favicon_image(): SiteDomainLogo {
    return this.getDataValue('favicon_image');
  }

  set favicon_image(value: SiteDomainLogo) {
    this.setDataValue('favicon_image', value);
  }
}
