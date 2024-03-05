import { AutoIncrement, Column, DataType, Default, HasMany, HasOne, Model, PrimaryKey } from 'sequelize-typescript';
import { ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import CmsImageItem from './CmsImageItem';
import { FORM_BANNER_SLIDE_TYPE_ENUM } from '../../helper/constants';
import { CustomTable } from './Base';
import FormBannerTextValue from './FormBannerTextValue';

@CustomTable('bb_cms_form_banner', false)
export default class FormBanner extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Default(1)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  active: number;

  @ApiModelProperty({
    example: Object.values(FORM_BANNER_SLIDE_TYPE_ENUM),
  })
  @Column({ type: new DataType.STRING(32), allowNull: false })
  type: string;

  @ApiModelProperty({
    example: '#000000',
  })
  @Column({ type: DataType.STRING(32), allowNull: false })
  title_color: string;

  @ApiModelProperty()
  @Column({ type: DataType.INTEGER, allowNull: true })
  cms_image_item_id: number;

  @ApiModelProperty({
    example: {
      uuid: '959eb674-3fc9-49e5-81b9-1cbd592b8476',
      extension: 'png',
      cmsImage: {
        name: 'Original-image-256x256-pixels.png',
      },
    },
  })
  @HasOne(() => CmsImageItem, { sourceKey: 'cms_image_item_id', foreignKey: 'id', as: 'cmsImageItem' })
  cmsImageItem: CmsImageItem;

  @HasMany(() => FormBannerTextValue, {
    sourceKey: 'id',
    foreignKey: 'form_banner_slide_id',
    as: 'text_values',
  })
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY,
    model: 'FormBannerTextValue',
    example: [
      {
        form_banner_slide_id: 4,
        language_id: 1,
        site_domain_id: 24,
        cards: null,
        text: 'test 3',
        site_domain: {
          id: 24,
          name: 'aaaa',
          url: 'www.d1qw.asd',
          active: 1,
          is_default: 1,
        },
        language: {
          id: 1,
          created_at: '2022-11-04T09:36:00.107Z',
          updated_at: '2022-11-04T09:36:00.107Z',
          name: 'English',
          short: 'en',
          position: 11,
          active: 1,
          is_default: 1,
          cms_image_item_id: null,
        },
      },
    ],
  })
  text_values: FormBannerTextValue[];

  @ApiModelProperty()
  @Column(DataType.VIRTUAL(DataType.STRING))
  get default_text(): string {
    return this.getDataValue('default_text');
  }

  set default_text(value: string) {
    this.setDataValue('default_text', value);
  }

  @ApiModelProperty()
  @Column(DataType.VIRTUAL(DataType.STRING))
  get default_cards_count(): number {
    return this.getDataValue('default_cards_count');
  }

  set default_cards_count(value: number) {
    this.setDataValue('default_cards_count', value);
  }
}
