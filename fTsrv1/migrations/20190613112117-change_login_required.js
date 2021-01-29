

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn('users', 'login', {
    type: Sequelize.TEXT,
    allowNull: false,
    notEmpty: true,
    unique: true,
  }),

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('users', 'login_unique_idx');
    return queryInterface.changeColumn('users', 'login', {
      type: Sequelize.TEXT,
      unique: false,
    });
  },
};
