'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    const { DataTypes } = Sequelize;

    try {

      await queryInterface.addColumn(
        'bb_rmt_base_settings',
        'max_win',
        {
          type: DataTypes.DECIMAL(12, 6),
          allowNull: true,
          defaultValue: null,
        },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      console.error(err);
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn('bb_rmt_base_settings', 'max_win', { transaction });

      await transaction.commit();
    } catch (err) {
      console.error(err);
      await transaction.rollback();
      throw err;
    }
  },
};
