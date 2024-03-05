// migrations/<timestamp>-create-combo-bonuses.ts
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bb_combo_bonus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      min_odd: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'DRAFT'
      },

      schedule_start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      schedule_start_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      schedule_finish_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      schedule_finish_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },

      sport_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'bb_sport', key: 'id' }
      },

      schedule_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      schedule_days: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
      },
      time_zone: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      creator_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'bb_user', key: 'id' }
      },
      created_at: {
        type: new Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
    });

    await queryInterface.createTable('bb_combo_bonus_value', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      combo_bonus_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'bb_combo_bonus',
          field: 'id',
        },
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      site_domain_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'bb_site_domain',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      language_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'bb_translate_language',
          key: 'id',
        },
      },
    })


    /*  await queryInterface.createTable('bb_combo_bonus_sport', {
       id: {
         allowNull: false,
         autoIncrement: true,
         primaryKey: true,
         type: Sequelize.INTEGER
       },
       combo_bonus_id: {
         type: Sequelize.INTEGER,
         allowNull: false,
         references: { model: 'bb_combo_bonus', key: 'id' }
       },
       sport_id: {
         type: Sequelize.INTEGER,
         allowNull: false,
         references: { model: 'bb_sport', key: 'id' }
       },
     }) */

    await queryInterface.createTable('bb_combo_bonus_condition', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      combo_bonus_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'bb_combo_bonus', key: 'id', onDelete: 'CASCADE',
        }
      },
      from: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      bonus_odds: {
        type: Sequelize.DECIMAL,
        allowNull: false
      }

    })

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bb_combo_bonus_condition');
    await queryInterface.dropTable('bb_combo_bonus_value');
    await queryInterface.dropTable('bb_combo_bonus');
  }
};
