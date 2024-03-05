'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable('bb_site_alias', 'bb_site_domain');
    await queryInterface.renameTable('bb_site_alias_logo', 'bb_site_domain_logo');
    await queryInterface.renameColumn('bb_site_domain_logo', 'site_alias_id', 'site_domain_id');
    await queryInterface.renameColumn('bb_cms_burger_block_item_value', 'site_alias_id', 'site_domain_id');
    await queryInterface.renameColumn('bb_cms_burger_block_value', 'site_alias_id', 'site_domain_id');
    await queryInterface.renameColumn('bb_cms_footer_chat_value', 'site_alias_id', 'site_domain_id');
    await queryInterface.renameColumn('bb_cms_footer_group_element_value', 'site_alias_id', 'site_domain_id');
    await queryInterface.renameColumn('bb_cms_footer_group_value', 'site_alias_id', 'site_domain_id');
    await queryInterface.renameColumn('bb_cms_footer_logo_value', 'site_alias_id', 'site_domain_id');
    await queryInterface.renameColumn('bb_cms_footer_text', 'site_alias_id', 'site_domain_id');
    await queryInterface.renameColumn('bb_cms_footer_validator_value', 'site_alias_id', 'site_domain_id');
    await queryInterface.renameColumn('bb_cms_header_block_value', 'site_alias_id', 'site_domain_id');
    await queryInterface.renameColumn('bb_cms_page_faq_question', 'site_alias_id', 'site_domain_id');
    await queryInterface.renameColumn('bb_cms_page_value', 'site_alias_id', 'site_domain_id');
    await queryInterface.renameColumn('bb_competition_top_text_value', 'site_alias_id', 'site_domain_id');
    await queryInterface.renameColumn('bb_cms_form_banner_value', 'site_alias_id', 'site_domain_id');
    await queryInterface.renameColumn('bb_cms_banner_main_slide_text_value', 'site_alias_id', 'site_domain_id');
    await queryInterface.renameColumn('bb_cms_static_page_value', 'site_alias_id', 'site_domain_id');
    await queryInterface.renameColumn('bb_translate_key_value', 'site_alias_id', 'site_domain_id');

    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'settings/domain',  
            display_name = 'Domain view',  
            path = 'General/Domain'
         WHERE 
            name = 'settings/alias' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'settings/domain/save',  
            display_name = 'Domain save',  
            path = 'General/Domain'
         WHERE 
            name = 'settings/alias/save' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'settings/domain/delete',  
            display_name = 'Domain delete',  
            path = 'General/Domain'
         WHERE 
            name = 'settings/alias/delete' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'settings/domain/add',  
            display_name = 'Domain add',  
            path = 'General/Domain'
         WHERE 
            name = 'settings/alias/add' `,
        { transaction },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable('bb_site_domain', 'bb_site_alias');
    await queryInterface.renameTable('bb_site_domain_logo', 'bb_site_alias_logo');
    await queryInterface.renameColumn('bb_site_domain_logo', 'site_domain_id', 'site_alias_id');
    await queryInterface.renameColumn('bb_cms_burger_block_item_value', 'site_domain_id', 'site_alias_id');
    await queryInterface.renameColumn('bb_cms_burger_block_value', 'site_domain_id', 'site_alias_id');
    await queryInterface.renameColumn('bb_cms_footer_chat_value', 'site_domain_id', 'site_alias_id');
    await queryInterface.renameColumn('bb_cms_footer_group_element_value', 'site_domain_id', 'site_alias_id');
    await queryInterface.renameColumn('bb_cms_footer_group_value', 'site_domain_id', 'site_alias_id');
    await queryInterface.renameColumn('bb_cms_footer_logo_value', 'site_domain_id', 'site_alias_id');
    await queryInterface.renameColumn('bb_cms_footer_text', 'site_domain_id', 'site_alias_id');
    await queryInterface.renameColumn('bb_cms_footer_validator_value', 'site_domain_id', 'site_alias_id');
    await queryInterface.renameColumn('bb_cms_header_block_value', 'site_domain_id', 'site_alias_id');
    await queryInterface.renameColumn('bb_cms_page_faq_question', 'site_domain_id', 'site_alias_id');
    await queryInterface.renameColumn('bb_cms_page_value', 'site_domain_id', 'site_alias_id');
    await queryInterface.renameColumn('bb_competition_top_text_value', 'site_domain_id', 'site_alias_id');
    await queryInterface.renameColumn('bb_cms_form_banner_value', 'site_domain_id', 'site_alias_id');
    await queryInterface.renameColumn('bb_cms_banner_main_slide_text_value', 'site_domain_id', 'site_alias_id');
    await queryInterface.renameColumn('bb_cms_static_page_value', 'site_domain_id', 'site_alias_id');
    await queryInterface.renameColumn('bb_translate_key_value', 'site_domain_id', 'site_alias_id');

    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'settings/alias',  
            display_name = 'Alias view',  
            path = 'General/Alias'
         WHERE 
            name = 'settings/domain' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'settings/alias/save',  
            display_name = 'Alias save',  
            path = 'General/Alias'
         WHERE 
            name = 'settings/domain/save' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'settings/alias/delete',  
            display_name = 'Alias delete',  
            path = 'General/Alias'
         WHERE 
            name = 'settings/domain/delete' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'settings/alias/add',  
            display_name = 'Alias add',  
            path = 'General/Alias'
         WHERE 
            name = 'settings/domain/add' `,
        { transaction },
      );
    });
  },
};
