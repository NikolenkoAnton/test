'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
   //  await queryInterface.sequelize.query(`alter table bb_team
   // ADD CONSTRAINT team_unique UNIQUE (sport_id, en);`);
   //
   //  await queryInterface.sequelize.query(`alter table bb_category
   // ADD CONSTRAINT category_unique UNIQUE(sport_id, en)`);

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
