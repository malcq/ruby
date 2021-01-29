

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'phone', {
    type: Sequelize.STRING,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'phone', {
    type: Sequelize.DATE,
  }),
};
