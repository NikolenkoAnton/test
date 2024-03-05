'use strict';

/** @type {import('sequelize-cli').Migration} */
async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('bb_note', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    path: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    creator_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'bb_user', key: 'id' }
    },
    text: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    created_at: {
      type: new Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW')
    },
  });

  await queryInterface.addIndex('bb_note', ['path'], {
    name: 'bb_note_path_index',
    unique: false
  });


  await queryInterface.createTable('bb_note_user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'bb_user', key: 'id' }
    },
    note_path: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    last_read_time: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  });

  await queryInterface.addIndex('bb_note_user', ['note_path'], {
    name: 'bb_note_user_path_index',
    unique: false
  });
}

async function down(queryInterface, Sequelize) {

  await queryInterface.sequelize.query(`drop index bb_note_user_path_index;`)
  await queryInterface.sequelize.query(`drop index bb_note_path_index;`)

  await queryInterface.dropTable('bb_note_user');
  await queryInterface.dropTable('bb_note');
}


module.exports = { up, down };