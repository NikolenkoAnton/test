'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.sequelize.transaction(async (transaction) => {
      const [{ id: site_alias_id }] = await queryInterface.select(null, 'bb_site_alias', {
        order: [['id', 'ASC']],
        limit: 1,
        raw: true,
      });

      const [{ id: language_id }] = await queryInterface.select(null, 'bb_translate_language', {
        order: [['id', 'ASC']],
        limit: 1,
        where: { name: 'English' },
        raw: true,
      });


      await queryInterface.insert(
        null,
        'bb_cms_header_block',
        {
          position: 8,
          url: 'casino',
          type: 'AVIATOR',
          active: 0
        },
        { transaction },
      );


      const [{ id: cms_header_block_id }] = await queryInterface.select(null, 'bb_cms_header_block', {
        order: [['id', 'ASC']],
        limit: 1,
        where: { type: 'AVIATOR' },
        raw: true,
        transaction,
      });

      await queryInterface.insert(
        null,
        'bb_cms_header_block_value',
        {
          cms_header_block_id,
          title: 'Aviator',
          language_id,
          site_alias_id,
        },
        { transaction },
      );

      await queryInterface.insert(
        null,
        'bb_burger_block',
        {
          position: 8,
          active: 0,
          type: 'aviator',
          can_has_items: 1,
        },
        { transaction },
      );

      const [{ id: burger_block_id }] = await queryInterface.select(null, 'bb_burger_block', {
        order: [['id', 'ASC']],
        limit: 1,
        where: { type: 'aviator' },
        raw: true,
        transaction,
      });

      await queryInterface.insert(
        null,
        'bb_burger_block_value',
        {
          burger_block_id,
          name: 'Aviator',
          language_id,
          site_alias_id,
        },
        { transaction },
      );
    });
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
