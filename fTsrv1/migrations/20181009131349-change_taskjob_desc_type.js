

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn('taskJobs', 'description', {
    type: Sequelize.TEXT,
    notEmpty: true,
  }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn('taskJobs', 'description', {
    type: Sequelize.STRING,
    notEmpty: true,
  }),
};
