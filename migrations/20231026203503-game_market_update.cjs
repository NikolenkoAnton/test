const {DataType} = require("sequelize-typescript");
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn("bb_game_market", "period", {
        type: new DataType.STRING(255),
        allowNull: true
      }),
      queryInterface.changeColumn("bb_game_market", "value", {
        type: new DataType.STRING(255),
        allowNull: true
      }),
    ]);
  },

  async down () {
    return Promise.all([])
  }
};