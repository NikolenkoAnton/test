module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    return Promise.all([
      queryInterface.changeColumn('bb_translate', 'translate_language_id', {
        type: 'INTEGER USING CAST("translate_language_id" as INTEGER)',
        allowNull: false,
      }),
    ]);
  },

  async down() {
    return Promise.all([]);
  },
};
