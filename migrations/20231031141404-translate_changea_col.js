'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.renameColumn('bb_translate', 'language', 'translate_language_id', { transaction });
      await queryInterface.removeColumn('bb_sport', 'ru', { transaction });
      await queryInterface.removeColumn('bb_sport', 'tr', { transaction });
      await queryInterface.removeColumn('bb_sport', 'uk', { transaction });

      await transaction.commit();
    } catch (err) {
      console.error(err);
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.renameColumn('bb_translate', 'translate_language_id', 'language', { transaction });
      await queryInterface.addColumn(
        'bb_sport',
        'ru',
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'bb_sport',
        'tr',
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'bb_sport',
        'uk',
        {
          type: DataTypes.STRING,
          allowNull: true,
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
};
