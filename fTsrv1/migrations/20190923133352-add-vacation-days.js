module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('requests', 'rest_days_number', {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('requests', 'rest_days_number', {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  }),
};
