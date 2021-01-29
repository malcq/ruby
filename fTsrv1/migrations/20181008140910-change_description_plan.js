

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn('plans', 'description', {
    type: Sequelize.TEXT,
  }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn('plans', 'description', {
    type: Sequelize.STRING,
  }),
};
