

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('projects', 'role', {
    type: Sequelize.TEXT,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('projects', 'role', {
    type: Sequelize.TEXT,
  }),
};
