'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    const { DataTypes } = Sequelize;

    try {
      await queryInterface.sequelize.query(
        `
        DELETE FROM bb_translate where id IN (
        SELECT MIN(id)
        FROM public.bb_translate
        group by bb_translate.type, parent_id, translate_language_id
        having count(id) > 1
        )
        `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `
        ALTER TABLE bb_translate
           ADD CONSTRAINT bb_translate_unique UNIQUE(type, parent_id, translate_language_id);
      `,
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
    return queryInterface.sequelize.query(
      `
        ALTER TABLE bb_translate
           DROP CONSTRAINT bb_translate_unique;
      `,
    );
  },
};
