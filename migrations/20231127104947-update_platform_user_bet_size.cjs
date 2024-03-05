const {DataType} = require("sequelize-typescript");
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn("bb_platform_user_bet_size_default", "col1", {
        type: new DataType.STRING(64),
        allowNull: false
      }),
      queryInterface.changeColumn("bb_platform_user_bet_size_default", "col2", {
        type: new DataType.STRING(64),
        allowNull: false
      }),
      queryInterface.changeColumn("bb_platform_user_bet_size_default", "col3", {
        type: new DataType.STRING(64),
        allowNull: false
      }),
      queryInterface.changeColumn("bb_platform_user_bet_size", "col1", {
        type: new DataType.STRING(64),
        allowNull: false
      }),
      queryInterface.changeColumn("bb_platform_user_bet_size", "col2", {
        type: new DataType.STRING(64),
        allowNull: false
      }),
      queryInterface.changeColumn("bb_platform_user_bet_size", "col3", {
        type: new DataType.STRING(64),
        allowNull: false
      }),
    ]);
  },

  async down () {
    return Promise.all([])
  }
};