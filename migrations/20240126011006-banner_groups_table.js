'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {


      await queryInterface.createTable('bb_cms_banner_main_slide_group', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        banner_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'bb_cms_banner_main_slide', key: 'id', onDelete: 'CASCADE' }
        },
        group_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'bb_platform_group', key: 'id', onDelete: 'CASCADE' }
        },
        created_at: {
          type: new Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        },
      }, { transaction });
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bb_cms_banner_main_slide_group');
  }
};
