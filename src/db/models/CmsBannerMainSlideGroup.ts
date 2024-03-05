import { AutoIncrement, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { CustomTable } from './Base';
import PlatformGroup from './PlatformGroup';
import Banner from './Banner';
import MainBannerSlide from './MainBannerSlide';

@CustomTable('bb_cms_banner_main_slide_group', false)
export default class CmsBannerMainSlideGroup extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => MainBannerSlide)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: { model: 'bb_cms_banner_main_slide', key: 'id' },
  })
  banner_id: number;

  @ForeignKey(() => PlatformGroup)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: { model: 'bb_platform_group', key: 'id' },
  })
  group_id: number;

  //   @Default(sequelize.fn('NOW'))
  @Column(DataType.DATE)
  created_at: Date;
}
