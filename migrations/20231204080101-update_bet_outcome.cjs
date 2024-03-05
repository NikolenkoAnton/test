const {DataType} = require("sequelize-typescript");
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn("bb_bet_outcome", "game_market_period", {
        type: new DataType.STRING(12),
        allowNull: true
      })
    ]);
  },

  async down () {
    return Promise.all([])
  }
};