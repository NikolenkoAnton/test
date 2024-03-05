'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.sequelize.query(`ALTER TABLE bb_bet_outcome_attributes
    DROP CONSTRAINT bb_bet_outcome_attributes_home_team_id_fkey;

ALTER TABLE bb_bet_outcome_attributes
    DROP CONSTRAINT bb_bet_outcome_attributes_away_team_id_fkey;`)
  },


  async down(queryInterface, Sequelize) {

  }
};
