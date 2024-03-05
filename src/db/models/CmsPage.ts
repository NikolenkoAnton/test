import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { CmsPageValue } from './index';
@ApiModel({
  name: 'CmsPage',
})
@Table({ timestamps: true, tableName: 'bb_cms_page', freezeTableName: true, underscored: true })
export default class CmsPage extends Model {
  @PrimaryKey
  @AutoIncrement
  @ApiModelProperty()
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @Column({ type: DataType.TEXT })
  url: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @ApiModelProperty({
    model: 'CmsPageValue',
    type: SwaggerDefinitionConstant.Model.Type.ARRAY,
    example: [
      {
        id: 26,
        language_id: 1,
        site_domain_id: 24,
        title: 'Titels 1',
        description: 'description',
        text: 'text',
        text_btn: 'text btn',
        index: true,
        faq_title: 'FAQqwe',
        faq_active: 1,
        site_domain: {
          name: 'aaaa',
          url: 'www.d1qw.asd',
        },
        redirect_target: 'http://ccc123.com',
        redirect_type: 302,
        language: {
          name: 'English',
          short: 'en',
        },
        faq_questions: [
          {
            id: 30,
            question: 'q111',
            answer: 'a111',
            position: 1,
            language_id: 1,
            site_domain_id: 24,
          },
          {
            id: 31,
            question: 'q222',
            answer: 'a222',
            position: 2,
            language_id: 1,
            site_domain_id: 24,
          },
          {
            id: 32,
            question: 'q333',
            answer: 'a333',
            position: 3,
            language_id: 1,
            site_domain_id: 24,
          },
        ],
      },
    ],
  })
  @HasMany(() => CmsPageValue, { sourceKey: 'id', foreignKey: 'cms_page_id', as: 'values' })
  values: CmsPageValue[];
}
