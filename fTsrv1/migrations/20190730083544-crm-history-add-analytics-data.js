module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('crm_histories', 'moved_to_stage', {
    type: Sequelize.INTEGER,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('crm_histories', 'moved_to_stage', {
    type: Sequelize.INTEGER,
  }),
};
