

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'repo',
    { type: Sequelize.ARRAY(Sequelize.STRING) }),

  down: queryInterface => queryInterface.removeColumn('users', 'repo'),
};
