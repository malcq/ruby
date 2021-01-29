

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'DoB', {
    type: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'DoB', {
    type: Sequelize.DATE,
  }),
};
