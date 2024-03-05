'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    const { DataTypes } = Sequelize;

    try {
      await queryInterface.addColumn(
        'bb_rmt_player',
        'id',
        {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
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
      await queryInterface.removeColumn('bb_rmt_player', 'id', { transaction });

      await transaction.commit();
    } catch (err) {
      console.error(err);
      await transaction.rollback();
      throw err;
    }
  },
};
