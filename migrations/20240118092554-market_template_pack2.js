'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {

      await queryInterface.sequelize.query(
        `INSERT INTO bb_template_view_column (id, name, template_view_id, position) VALUES 
        (63, 'Home', 22, 0),
        (64, 'Draw', 22, 1),
        (65, 'Away', 22, 2),
        (66, 'Home', 23, 0),
        (67, 'Away', 23, 1)`,
        { transaction },
      );
    })
  },

  async down(queryInterface, Sequelize) {

  }
};
