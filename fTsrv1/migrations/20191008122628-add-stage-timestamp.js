module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn('crm_tasks', 'stage_ts', {
      type: Sequelize.DATE,
    }),

  down: (queryInterface, Sequelize) => queryInterface
    .removeColumn('crm_tasks', 'stage_ts', {
      type: Sequelize.DATE,
    }),
};
