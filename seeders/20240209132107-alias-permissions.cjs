const { permissionsSeed } = require('../migrations_tools/migration_tools.cjs')

const permissions = [
  {
    url: 'settings/alias/add',
    name: 'Alias add',
    path: 'General/Alias'
  }
];
/** @type {import('sequelize-cli').Migration} */
module.exports = permissionsSeed(permissions);
