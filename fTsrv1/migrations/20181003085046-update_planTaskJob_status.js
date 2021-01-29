

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn('plan_taskJobs', 'status', {
    type: Sequelize.STRING,
  }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn('plan_taskJobs', 'status', {
    type: Sequelize.BOOLEAN,
  }),
};
