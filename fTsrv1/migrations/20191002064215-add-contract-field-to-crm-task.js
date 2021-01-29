module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('crm_tasks', 'contract', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('crm_tasks', 'contract', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }),
};
