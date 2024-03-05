'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {

      await queryInterface.sequelize.query(
        `UPDATE bb_bet SET result = null WHERE result = 'in_progress'`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_bet_outcome SET result = null WHERE result = 'in_progress'`,
        { transaction },
      );
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {

      await queryInterface.sequelize.query(
        `UPDATE bb_bet SET result = 'in_progress' WHERE result is null `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_bet_outcome SET result = 'in_progress' WHERE result is null `,
        { transaction },
      );
    })
  }
};
