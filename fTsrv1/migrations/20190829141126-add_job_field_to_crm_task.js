module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('crm_tasks', 'job_link', {
    type: Sequelize.STRING,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('crm_tasks', 'job_link', {
    type: Sequelize.STRING,
  }),
};
