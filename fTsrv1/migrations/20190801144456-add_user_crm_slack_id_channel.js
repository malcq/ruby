module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'slack_conversational_crm_id', {
    type: Sequelize.STRING,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'slack_conversational_crm_id', {
    type: Sequelize.INTEGER,
  }),
};
