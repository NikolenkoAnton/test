'use strict';
const { MigrationHelper } = require('../migrations_tools/migration_helper.cjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // return queryInterface.sequelize.transaction(async (transaction) => {
    //   const helper = new MigrationHelper('bb_bet_outcome_attributes', queryInterface, transaction);
    //   const columns = [
    //     {
    //       name: 'home_team_name',
    //       type: Sequelize.TEXT,
    //       allowNull: true
    //     },
    //     {
    //       name: 'away_team_name',
    //       type: Sequelize.TEXT,
    //       allowNull: true
    //     },

    //     {
    //       name: 'outcome_name',
    //       type: Sequelize.TEXT,
    //       allowNull: true
    //     },

    //   ];

    //   await helper.addColumns(columns);

    //   // await queryInterface.sequelize.query(`
    //   // ALTER TABLE bb_bet_outcome_attributes  
    //   // ALTER COLUMN event_start TYPE timestamp with time zone
    //   // USING to_timestamp(event_start / 1000);`, { transaction })

    //   await queryInterface.sequelize.query(`
    //   ALTER TABLE bb_bet_outcome_attributes
    //   DROP COLUMN teams;

    //   `, { transaction });

    //   await queryInterface.sequelize.query(`

    //   alter table bb_bet_outcome
    // alter column outcome_id drop not null;
    //   `, { transaction });
    // });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      const helper = new MigrationHelper('bb_bet_outcome_attributes', queryInterface, transaction);

      await helper.removeColumns(['home_team_name', 'away_team_name', 'outcome_name']);
    });
  }
};

