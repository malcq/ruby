

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('plans', 'idChain', {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('plans', 'idChain', {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
  }),
};
