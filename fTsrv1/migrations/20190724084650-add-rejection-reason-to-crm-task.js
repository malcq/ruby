module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn('crm_tasks', 'reject_reason_comment', {
      type: Sequelize.STRING,
    })
    .then(() => queryInterface.addColumn('crm_tasks', 'reject_reason_date', {
      type: Sequelize.DATE,
    }))
    .then(() => queryInterface.addColumn('crm_tasks', 'reject_reason_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'crm_reject_reasons',
        key: 'id',
      },
    })),

  down: (queryInterface, Sequelize) => queryInterface
    .removeColumn('crm_tasks', 'reject_reason_id', {
      type: Sequelize.INTEGER,
    })
    .then(() => queryInterface.removeColumn('crm_tasks', 'reject_reason_date', {
      type: Sequelize.DATE,
    }))
    .then(() => queryInterface.removeColumn('crm_tasks', 'reject_reason_comment', {
      type: Sequelize.STRING,
    })),
};
