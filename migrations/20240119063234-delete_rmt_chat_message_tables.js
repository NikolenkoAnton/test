'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('bb_rmt_chat_message_read');
    await queryInterface.dropTable('bb_rmt_chat_message');
  },

  async down(queryInterface, Sequelize) {

  }
};
