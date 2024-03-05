'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.createTable('bb_platform_user_bet_size_default', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      currency_id: {
        type: new DataTypes.INTEGER,
        allowNull: false
      },
      col1: {
        type: new DataTypes.DECIMAL(12, 6),
        allowNull: false
      },
      col2: {
        type: new DataTypes.DECIMAL(12, 6),
        allowNull: false
      },
      col3: {
        type: new DataTypes.DECIMAL(12, 6),
        allowNull: false
      },
      created_at: {
        type: new DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: DataTypes.DATE
    });
    await queryInterface.createTable('bb_platform_user_bet_size', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      currency_id: {
        type: new DataTypes.INTEGER,
        allowNull: false
      },
      platform_user_id: {
        type: new DataTypes.INTEGER,
        allowNull: false
      },
      col1: {
        type: new DataTypes.DECIMAL(12, 6),
        allowNull: false
      },
      col2: {
        type: new DataTypes.DECIMAL(12, 6),
        allowNull: false
      },
      col3: {
        type: new DataTypes.DECIMAL(12, 6),
        allowNull: false
      },
      created_at: {
        type: new DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: DataTypes.DATE
    });
    await queryInterface.createTable('bb_platform_user_bet_setting', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      platform_user_id: {
        type: new DataTypes.INTEGER,
        allowNull: false
      },
      accept_odds_change: {
        type: new DataTypes.STRING(64),
        allowNull: false
      },
      created_at: {
        type: new DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: DataTypes.DATE
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bb_platform_user_bet_size_default');
    await queryInterface.dropTable('bb_platform_user_bet_size');
    await queryInterface.dropTable('bb_platform_user_bet_setting');
  }
};
