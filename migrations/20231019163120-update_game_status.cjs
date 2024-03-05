const {DataType} = require("sequelize-typescript");
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn("bb_game", "status", {
        type: new DataType.STRING(32),
        allowNull: false
      })
    ]);
  },

  async down () {
    return Promise.all([])
  }
};