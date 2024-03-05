'use strict';

const {DataTypes} = require('sequelize');
module.exports = {
  async up(queryInterface, Sequelize) {
    const translates = {
      "esports.view-full-live": "view full live",
      "esports.show-coefficients": "show coefficients",
      "esports.watch-also": "Watch also",
      "esports.view-all-cyber": "view all cyber",
      "esports.view-all-other": "view all other",
      "esports.match-login-error": 'lick on "LOGIN" to see your favorite team’s game broadcast',
    };

    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.changeColumn('bb_translate_key_value', 'value', {
        type: DataTypes.TEXT
      })
      for (let key in translates) {
        let group = key.includes('.') ? key.split('.')[0] : null;
        await queryInterface.sequelize.query(`INSERT INTO bb_translate_key ("key", "group") VALUES (:key, :group) ON CONFLICT DO NOTHING`,
          {replacements: {key, group}, transaction});
        await queryInterface.sequelize.query(`DELETE FROM bb_translate_key_value WHERE ` +
          `translate_key_id = (SELECT id FROM bb_translate_key WHERE "key" = :key LIMIT 1) AND ` +
          `language_id = (SELECT id FROM bb_translate_language WHERE short = 'en' LIMIT 1) AND ` +
          `site_alias_id = (SELECT id FROM bb_site_alias WHERE is_default = 1 LIMIT 1)`,
          {replacements: {key}, transaction});
        await queryInterface.sequelize.query(`INSERT INTO bb_translate_key_value ("translate_key_id", "language_id", "site_alias_id", "value") ` +
          `VALUES ((SELECT id FROM bb_translate_key WHERE "key" = :key LIMIT 1), ` +
          `(SELECT id FROM bb_translate_language WHERE short = 'en' LIMIT 1), ` +
          `(SELECT id FROM bb_site_alias WHERE is_default = 1 LIMIT 1), :value)`,
          {replacements: {key, value:translates[key]}, transaction});
      }
      await transaction.commit();
    } catch (err) {
      console.error(err);
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {},
};
