const { MigrationHelper } = require('../migrations_tools/migration_helper.cjs');


module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    return queryInterface.sequelize.transaction(async (transaction) => {
      let helper = new MigrationHelper('bb_rmt_base_settings', queryInterface, transaction);
      let columns = [
        {
          name: 'show_market_sum_limit',
          type: DataTypes.DECIMAL(13, 2),
          allowNull: true,
          defaultValue: 1,
        },
        {
          name: 'show_market_time_limit',
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 1,
        },
        {
          name: 'odd_events_count',
          type: DataTypes.DECIMAL(13, 2),
          allowNull: true,
        },
        {
          name: 'odd_events_count_power',
          type: DataTypes.DECIMAL(13, 2),
          allowNull: true,
        },
        {
          name: 'max_win_combos_systems',
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        {
          name: 'maximal_max_win_per_event',
          type: DataTypes.DECIMAL(13, 2),
          allowNull: true,
        },
        {
          name: 'minimal_max_win_per_event',
          type: DataTypes.DECIMAL(13, 2),
          allowNull: true,
        }
      ];

      await helper.changeColumns(columns);

      const helper1 = new MigrationHelper('bb_rmt_base_settings_odds', queryInterface, transaction);
      const columns1 = [
        {
          name: 'to',
          type: DataTypes.DECIMAL(13, 2),
          allowNull: true,
        },
        {
          name: 'step',
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
