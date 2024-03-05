const { MigrationHelper } = require('../migrations_tools/migration_helper.cjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    return queryInterface.sequelize.transaction(async (transaction) => {
      let helper = new MigrationHelper('bb_rmt_base_settings_margin', queryInterface, transaction);
      let columns = [
        {
          name: 'margin_percent',
          type: DataTypes.DECIMAL(13, 2),
          allowNull: true,
          defaultValue: 1,
        },
      ];

      await helper.changeColumns(columns);
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
