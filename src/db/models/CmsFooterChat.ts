import { AutoIncrement, Column, DataType, Default, ForeignKey, HasMany, Model, PrimaryKey } from 'sequelize-typescript';
import CmsFooterGroup from './CmsFooterGroup';
import { ApiModelProperty } from 'swagger-express-ts';
import { CustomTable } from './Base';
import CmsFooterChatValue from './CmsFooterChatValue';

@CustomTable('bb_cms_footer_chat', false)
export default class CmsFooterChat extends Model {
  @ApiModelProperty()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiModelProperty()
  @ForeignKey(() => CmsFooterGroup)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: 'CmsFooterGroup', key: 'id' },
    onDelete: 'CASCADE',
  })
  cms_footer_block_id: number;

  @ApiModelProperty({
    model: 'CmsFooterChatValue',
    example: [
      {
        id: 5,
        cms_footer_chat_id: 2,
        name: 'd',
        site_domain_id: 24,
        language_id: 1,
        language: {
          name: 'English',
          short: 'en',
        },
        site_domain: {
          url: 'www.d1qw.asd',
        },
      },
      {
        id: 6,
        cms_footer_chat_id: 2,
        name: 'qqqqqqqqqqqqqqqqqqqqqqqqq',
        site_domain_id: 24,
        language_id: 2,
        language: {
          name: 'Russian',
          short: 'ru',
        },
        site_domain: {
          url: 'www.d1qw.asd',
        },
      },
    ],
  })
  @HasMany(() => CmsFooterChatValue, { sourceKey: 'id', foreignKey: 'cms_footer_chat_id', as: 'values' })
  values: Array<CmsFooterChatValue>;
}
