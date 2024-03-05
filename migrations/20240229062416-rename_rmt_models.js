'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('bb_rmt_market', 'max_win_player_event', 'max_risk_player_event');
    await queryInterface.renameColumn('bb_rmt_competition', 'max_win_player_event', 'max_risk_player_event');
    await queryInterface.renameColumn('bb_rmt_category', 'max_win_player_event', 'max_risk_player_event');
    await queryInterface.renameColumn('bb_rmt_sport', 'max_win_player_event', 'max_risk_player_event');
    await queryInterface.renameColumn('bb_rmt_team', 'max_win_player_event', 'max_risk_player_event');

    await queryInterface.renameColumn('bb_rmt_market', 'max_win_bet', 'max_risk_bet');
    await queryInterface.renameColumn('bb_rmt_competition', 'max_win_bet', 'max_risk_bet');
    await queryInterface.renameColumn('bb_rmt_category', 'max_win_bet', 'max_risk_bet');
    await queryInterface.renameColumn('bb_rmt_sport', 'max_win_bet', 'max_risk_bet');
    await queryInterface.renameColumn('bb_rmt_team', 'max_win_bet', 'max_risk_bet');

    await queryInterface.renameColumn('bb_rmt_base_settings', 'minimal_max_win_per_bet', 'minimal_max_risk_per_bet');
    await queryInterface.renameColumn('bb_rmt_base_settings', 'maximal_max_win_per_bet', 'maximal_max_risk_per_bet');
    await queryInterface.renameColumn('bb_rmt_base_settings', 'max_win_combos_systems', 'max_risk_combos_systems');
    await queryInterface.renameColumn('bb_rmt_base_settings', 'basic_max_win_per_event', 'basic_max_risk_per_event');
    await queryInterface.renameColumn('bb_rmt_base_settings', 'minimal_max_win_per_event', 'minimal_max_risk_per_event');
    await queryInterface.renameColumn('bb_rmt_base_settings', 'maximal_max_win_per_event', 'maximal_max_risk_per_event');

    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'cms/event-list',  
            display_name = 'Event list view',  
            path = 'CMS/Event list'
         WHERE 
            name = 'cms/sport-list' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'cms/event-list/save',  
            display_name = 'Event list save',  
            path = 'CMS/Event list'
         WHERE 
            name = 'cms/sport-list/save' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'data/event',  
            display_name = 'Event data view'  
         WHERE 
            name = 'data/sport' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'player/events',  
            display_name = 'Player stat by event view'  
         WHERE 
            name = 'player/sports' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'rmt/event/save',  
            display_name = 'RMT event category competition save'  
         WHERE 
            name = 'rmt/sport/save' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'rmt/event',  
            display_name = 'RMT event view'  
         WHERE 
            name = 'rmt/sport' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'rmt/event-by-competition',  
            display_name = 'RMT event group by competition view'  
         WHERE 
            name = 'rmt/sport-by-competition' `,
        { transaction },
      );
    });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.renameColumn('bb_rmt_market', 'max_risk_player_event', 'max_win_player_event');
    await queryInterface.renameColumn('bb_rmt_competition', 'max_risk_player_event', 'max_win_player_event');
    await queryInterface.renameColumn('bb_rmt_category', 'max_risk_player_event', 'max_win_player_event');
    await queryInterface.renameColumn('bb_rmt_sport', 'max_risk_player_event', 'max_win_player_event');
    await queryInterface.renameColumn('bb_rmt_team', 'max_risk_player_event', 'max_win_player_event');

    await queryInterface.renameColumn('bb_rmt_market', 'max_risk_bet', 'max_win_bet');
    await queryInterface.renameColumn('bb_rmt_competition', 'max_risk_bet', 'max_win_bet');
    await queryInterface.renameColumn('bb_rmt_category', 'max_risk_bet', 'max_win_bet');
    await queryInterface.renameColumn('bb_rmt_sport', 'max_risk_bet', 'max_win_bet');
    await queryInterface.renameColumn('bb_rmt_team', 'max_risk_bet', 'max_win_bet');

    await queryInterface.renameColumn('bb_rmt_base_settings', 'minimal_max_risk_per_bet', 'minimal_max_win_per_bet');
    await queryInterface.renameColumn('bb_rmt_base_settings', 'maximal_max_risk_per_bet', 'maximal_max_win_per_bet');
    await queryInterface.renameColumn('bb_rmt_base_settings', 'max_risk_combos_systems', 'max_win_combos_systems');
    await queryInterface.renameColumn('bb_rmt_base_settings', 'basic_max_risk_per_event', 'basic_max_win_per_event');
    await queryInterface.renameColumn('bb_rmt_base_settings', 'minimal_max_risk_per_event', 'minimal_max_win_per_event');
    await queryInterface.renameColumn('bb_rmt_base_settings', 'maximal_max_risk_per_event', 'maximal_max_win_per_event');

    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'cms/sport-list',  
            display_name = 'Sport list view',  
            path = 'CMS/Sport list'
         WHERE 
            name = 'cms/event-list' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'cms/sport-list/save',  
            display_name = 'Sport list save',  
            path = 'CMS/Sport list'
         WHERE 
            name = 'cms/event-list/save' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'data/sport',  
            display_name = 'Sport data view'  
         WHERE 
            name = 'data/event' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'player/sports',  
            display_name = 'Player stat by sport view'  
         WHERE 
            name = 'player/events' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'rmt/sport/save',  
            display_name = 'RMT sport category competition save'  
         WHERE 
            name = 'rmt/event/save' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'rmt/sport',  
            display_name = 'RMT sport view'  
         WHERE 
            name = 'rmt/event' `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE bb_permission 
         SET 
            name = 'rmt/sport-by-competition',  
            display_name = 'RMT sport group by competition view'  
         WHERE 
            name = 'rmt/event-by-competition' `,
        { transaction },
      );
    });
  }
};
