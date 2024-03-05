import { PrimaryKey, AutoIncrement, Column, DataType, Model } from 'sequelize-typescript';
import { CustomTable } from './Base';

@CustomTable('bb_cms_footer_block_type', false)
export default class CmsFooterBlockType extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;
}
