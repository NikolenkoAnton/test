'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SeedHelper } = require('../migrations_tools/seed_helper.cjs');


const routePermissions = [
  {
    name: 'combo-bonus',
    display_name: 'Combo bonus view',
    path: 'Bonuses/Combo bonus',
    is_route: 1,
    created_at: new Date(),
  },
  {
    name: 'combo-bonus/save',
    display_name: 'Combo bonus save',
    path: 'Bonuses/Combo bonus',
    is_route: 1,
    created_at: new Date(),
  },
  {
    name: 'combo-bonus/delete',
    display_name: 'Combo bonus delete',
    path: 'Bonuses/Combo bonus',
    is_route: 1,
    created_at: new Date(),
  },
];

const helper = new SeedHelper('bb_permission');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await helper.setQueryInterface(queryInterface).insert(routePermissions);
  },

  down: async (queryInterface, Sequelize) => {
    await helper.setQueryInterface(queryInterface).delete({
      name: {
        [Sequelize.Op.in]: routePermissions.map((permission) => permission.name),
      },
    });
  },
};
