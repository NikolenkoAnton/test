'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.sequelize.query(`
   ALTER TABLE bb_team
    DROP CONSTRAINT IF EXISTS team_unique;

ALTER TABLE bb_team
    DROP CONSTRAINT IF EXISTS team_external_id_unique;

alter table bb_game
    DROP CONSTRAINT IF EXISTS game_external_id_unique;

alter table bb_category
    DROP CONSTRAINT IF EXISTS category_unique;

alter table bb_competition
    DROP CONSTRAINT IF EXISTS competition_unique;

alter table bb_competition
    DROP CONSTRAINT IF EXISTS competition_external_id_unique;

  `);


    await queryInterface.sequelize.query(`
    
    ALTER TABLE bb_team
   ADD CONSTRAINT team_external_id_unique UNIQUE(external_id);

ALTER TABLE bb_game
   ADD CONSTRAINT game_external_id_unique UNIQUE(external_id);

ALTER TABLE bb_category
   ADD CONSTRAINT category_external_id_unique UNIQUE(external_id);

ALTER TABLE bb_competition
   ADD CONSTRAINT competition_external_id_unique UNIQUE(external_id);

 `);


  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
