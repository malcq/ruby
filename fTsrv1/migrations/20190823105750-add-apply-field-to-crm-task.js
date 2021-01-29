module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('crm_tasks', 'proposal', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('crm_tasks', 'proposal', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }),
};
