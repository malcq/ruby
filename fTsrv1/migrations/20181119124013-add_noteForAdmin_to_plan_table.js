

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('plans', 'noteForAdmin', {
    type: Sequelize.TEXT,
  }),

  down: queryInterface => queryInterface.removeColumn('plans', 'noteForAdmin'),
};
