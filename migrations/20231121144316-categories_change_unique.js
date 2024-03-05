'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.query(`
   ALTER TABLE bb_category
    DROP CONSTRAINT IF EXISTS category_external_id_unique;
  `);

      await queryInterface.sequelize.query(`
    ALTER TABLE bb_category
   ADD CONSTRAINT category_external_id_unique UNIQUE(external_id, sport_id);
  `);
    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.query(`
   ALTER TABLE bb_category
    DROP CONSTRAINT IF EXISTS category_external_id_unique;
  `);

      await queryInterface.sequelize.query(`
    ALTER TABLE bb_category
   ADD CONSTRAINT category_external_id_unique UNIQUE(external_id);
  `);
    } catch (err) {
      console.log(err);
    }
  },
};
