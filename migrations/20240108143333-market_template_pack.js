'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {

      await queryInterface.sequelize.query(
        `INSERT INTO bb_template_view (id, name) VALUES 
        (22, 'Race to 1x2'),
        (23, 'Race to 12')`,
        { transaction },
      );
    })
  },

  async down(queryInterface, Sequelize) {

  }
};
