

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn('users', 'status', {
    type: Sequelize.STRING,
    defaultValue: 'registered',
  }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn('users', 'status', {
    type: Sequelize.STRING,
  }),
};
