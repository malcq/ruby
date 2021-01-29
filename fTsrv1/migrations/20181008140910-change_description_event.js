

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn('events', 'description', {
    type: Sequelize.TEXT,
  }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn('events', 'description', {
    type: Sequelize.STRING,
  }),
};
