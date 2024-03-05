'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SeedHelper } = require('../migrations_tools/seed_helper.cjs');

const routeGetUser =
  {
    name: 'user',
    display_name: 'Get user',
    path: 'User',
    is_route: 1,
    created_at: new Date(),
  };

const helperPermissions = new SeedHelper('bb_permission');
const helperPermissionsRole = new SeedHelper('bb_permission_role').setTransaction(helperPermissions.transaction);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await helperPermissions.setQueryInterface(queryInterface).insert([routeGetUser]);
    const [permission] = await queryInterface.sequelize.query(`select id from bb_permission where name = '${routeGetUser.name}'`);

    await helperPermissionsRole.setQueryInterface(queryInterface).insert([{
      permission_id: permission[0].id,
      role_id: 1,
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    const [permission] = await queryInterface.sequelize.query(`select id from bb_permission where name = '${routeGetUser.name}'`);
    await helperPermissions.setQueryInterface(queryInterface).delete({
      name: routeGetUser.name,
    });

    await helperPermissionsRole.setQueryInterface(queryInterface).delete({
      role_id: 1,
      permission_id: permission[0].id,
    });
  },
};
