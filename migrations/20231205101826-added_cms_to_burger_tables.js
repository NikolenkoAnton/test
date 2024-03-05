'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.sequelize.query(
    //   `
    //   ALTER TABLE bb_burger_block RENAME TO bb_cms_burger_block;
    //   ALTER TABLE bb_burger_block_item RENAME TO bb_cms_burger_block_item;
    //   ALTER TABLE bb_burger_block_item_value RENAME TO bb_cms_burger_block_item_value;
    //   ALTER TABLE bb_burger_block_value RENAME TO bb_cms_burger_block_value;
    //     `,
    // );
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
