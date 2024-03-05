'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bb_calendar_schedule', {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      entity_type: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
    });

    await queryInterface.addIndex('bb_calendar_schedule', ['start_time', 'end_time'], { unique: false });

    await queryInterface.addIndex('bb_calendar_schedule', ['entity_type'], { unique: false });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bb_calendar_schedule');
  }
};
