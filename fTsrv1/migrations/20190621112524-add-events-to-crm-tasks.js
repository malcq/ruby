module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn('crm_tasks', 'event_datetime', {
      type: Sequelize.DATE,
    })
    .then(() => queryInterface.addColumn('crm_tasks', 'event_desctiption', {
      type: Sequelize.STRING,
    })),

  down: (queryInterface, Sequelize) => queryInterface
    .removeColumn('crm_tasks', 'event_datetime', {
      type: Sequelize.DATE,
    })
    .then(() => queryInterface.removeColumn('crm_tasks', 'event_desctiption', {
      type: Sequelize.STRING,
    })),
};
