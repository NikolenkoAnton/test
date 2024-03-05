'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {

      await queryInterface.sequelize.query(
        `UPDATE bb_bet SET result = 'loss' WHERE result = 'lose'`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_bet SET result = 'loss_refund' WHERE result = 'lose_refund'`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_bet_outcome SET result = 'loss' WHERE result = 'lose'`,
        { transaction },
      );


      await queryInterface.sequelize.query(
        `UPDATE bb_bet_outcome SET result = 'loss_refund' WHERE result = 'lose_refund'`,
        { transaction },
      );

    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {

      await queryInterface.sequelize.query(
        `UPDATE bb_bet SET result = 'lose' WHERE result = 'loss' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_bet_outcome SET result = 'lose' WHERE result = 'loss' `,
        { transaction },
      );
    })
  }
};
