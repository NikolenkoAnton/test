'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SeedHelper } = require('../migrations_tools/seed_helper.cjs');

const routePermissions = [
  {
    name: 'note/save',
    display_name: 'Note save',
    path: 'Note',
    is_route: 1,
    created_at: new Date(),
  },
  {
    name: 'note',
    display_name: 'Get notes',
    path: 'Note',
    is_route: 1,
    created_at: new Date(),
  },
  {
    name: 'note/unread-count',
    display_name: 'Get unread notes count by path',
    path: 'Note',
    is_route: 1,
    created_at: new Date(),
  }
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
