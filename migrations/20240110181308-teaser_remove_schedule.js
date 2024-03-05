module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`UPDATE bb_cms_teaser SET schedule = null WHERE event_status = 'live'`);
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes if needed
    // Implement the logic to restore the previous values of the schedule field
  },
};
