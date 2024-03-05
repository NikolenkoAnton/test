'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {

      await queryInterface.sequelize.query(
        `UPDATE bb_bet SET result = 'part_win' WHERE result = 'win_refund'`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_bet SET result = 'part_loss' WHERE result = 'loss_refund'`,
        { transaction },
      );
    })
  },

  async down(queryInterface, Sequelize) {

  }
};
