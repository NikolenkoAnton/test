'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {

      await queryInterface.createTable('bb_platform_group', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        created_at: {
          type: new Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        },
      }, { transaction });


      await queryInterface.createTable('bb_platform_user_group', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'bb_platform_user', key: 'user_id' }
        },
        group_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'bb_platform_group', key: 'id', onDelete: 'CASCADE' }
        },
        created_at: {
          type: new Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        },
      }, { transaction });

    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bb_platform_user_group');
    await queryInterface.dropTable('bb_platform_group');
  }
};
