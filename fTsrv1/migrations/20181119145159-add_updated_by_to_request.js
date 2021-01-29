

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('requests', 'updated_by', {
    type: Sequelize.INTEGER,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('requests', 'updated_by', {
    type: Sequelize.INTEGER,
  }),
};
