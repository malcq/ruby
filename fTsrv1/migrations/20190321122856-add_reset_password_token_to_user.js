

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'resetPasswordToken', {
    type: Sequelize.TEXT,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'resetPasswordToken', {
    type: Sequelize.TEXT,
  }),
};
