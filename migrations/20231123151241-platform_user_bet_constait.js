'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`alter table bb_platform_user_bet_setting
   ADD CONSTRAINT platform_user_bet_setting_unique UNIQUE (platform_user_id)`);

    await queryInterface.sequelize.query(`alter table bb_platform_user_bet_size
   ADD CONSTRAINT platform_user_bet_size_unique UNIQUE(platform_user_id, currency_id)`);

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
