'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {

      await queryInterface.sequelize.query(
        `UPDATE bb_permission SET display_name = 'Note view' WHERE display_name = 'Get notes'`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission SET display_name = 'Unread note count by path view' WHERE display_name = 'Get unread notes count by path'`,
        { transaction },
      );
    })
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
