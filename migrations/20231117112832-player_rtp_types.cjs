const { MigrationHelper } = require('../migrations_tools/migration_helper.cjs');


module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    return queryInterface.sequelize.transaction(async (transaction) => {
      let helper = new MigrationHelper('bb_rmt_player_teor_rtp', queryInterface, transaction);
      let columns = [
        {
          name: 'from',
          type: DataTypes.DECIMAL(13, 2),
          allowNull: true
        },
        {
          name: 'to',
          type: DataTypes.DECIMAL(13, 2),
          allowNull: true
        },
        {
          name: 'k',
          type: DataTypes.DECIMAL(13, 2),
          allowNull: true
        },
      ];

      await helper.changeColumns(columns);

      const helper1 = new MigrationHelper('bb_rmt_player', queryInterface, transaction);
      const columns1 = [
        {
          name: 'nz_from',
          type: DataTypes.DECIMAL(13, 2),
          allowNull: true,
        },
        {
          name: 'nz_to',
          type: DataTypes.DECIMAL(13, 2),
          allowNull: true,
        }
      ]
      await helper1.changeColumns(columns1);
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
