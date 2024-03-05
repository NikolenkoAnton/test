'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    const { DataTypes } = Sequelize;

    try {
      await queryInterface.addColumn(
        'bb_sport',
        'match_type',
        {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'match',
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'bb_game',
        'match_type',
        {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'match',
        },
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_sport SET match_type = 'outright' WHERE external_id IN ('687888','687894','687893')`,
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
      await queryInterface.removeColumn('bb_sport', 'match_type', { transaction });
      await queryInterface.removeColumn('bb_game', 'match_type', { transaction });

      await transaction.commit();
    } catch (err) {
      console.error(err);
      await transaction.rollback();
      throw err;
    }
  },
};
