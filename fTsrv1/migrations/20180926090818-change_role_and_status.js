

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn('users', 'status', {
    type: Sequelize.TEXT,
  }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn('users', 'status', {
    type: Sequelize.ENUM('active', 'inactive'),
    defaultValue: 'active',
  }),
};
