'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SeedHelper } = require('../migrations_tools/seed_helper.cjs');

const routePermissions = [
  {
    name: 'player/graph',
    display_name: 'Player graph',
    path: 'Analytic/Player',
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
