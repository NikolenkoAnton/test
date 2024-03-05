'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {

      await queryInterface.sequelize.query(
        `UPDATE bb_bet SET type = 'single' WHERE type = 'ordinar'`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_bet SET type = 'combo' WHERE type = 'multi'`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_bet SET result = 'void' WHERE result = 'cancel'`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `alter table bb_bet
    alter column type set default 'single'::character varying;`,
        { transaction },
      );


    })
  },

  async down(queryInterface, Sequelize) {

  }
};
