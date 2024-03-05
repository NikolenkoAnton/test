'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('bb_cms_banner_main_slide', 'schedule_type', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('bb_cms_banner_main_slide', 'schedule_days', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
    });
    await queryInterface.addColumn('bb_cms_banner_main_slide', 'time_zone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('bb_cms_banner_main_slide', 'schedule_type');
    await queryInterface.removeColumn('bb_cms_banner_main_slide', 'schedule_days');
    await queryInterface.removeColumn('bb_cms_banner_main_slide', 'time_zone');
  }
};
