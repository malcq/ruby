

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'resetPasswordExpires', {
    type: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'resetPasswordExpires', {
    type: Sequelize.DATE,
  }),
};
