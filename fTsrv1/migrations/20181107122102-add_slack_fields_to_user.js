module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn('users', 'slack_name', {
      type: Sequelize.STRING,
    })
    .then(() => queryInterface.addColumn('users', 'slack_conversational_id', {
      type: Sequelize.STRING,
    })),

  down: (queryInterface, Sequelize) => queryInterface
    .removeColumn('users', 'slack_name', {
      type: Sequelize.STRING,
    })
    .then(() => queryInterface.removeColumn('users', 'slack_conversational_id', {
      type: Sequelize.STRING,
    })),
};
