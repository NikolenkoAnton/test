'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      alter table bb_bet
    alter column cashout_amount type numeric(12, 6) using cashout_amount::numeric(12, 6);`)
  },

  async down(queryInterface, Sequelize) {

  }
};
