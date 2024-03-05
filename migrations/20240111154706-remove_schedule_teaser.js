module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the 'schedule' column from the 'bb_cms_teaser' table
    await queryInterface.removeColumn('bb_cms_teaser', 'schedule');
  },

  async down(queryInterface, Sequelize) {
    // Add back the 'schedule' column to the 'bb_cms_teaser' table
    await queryInterface.addColumn('bb_cms_teaser', 'schedule', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
