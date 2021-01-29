

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('plan_taskJobs', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    plan_id: {
      type: Sequelize.INTEGER,
    },
    taskJob_id: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.BOOLEAN,
    },
    startTask: {
      type: Sequelize.DATE,
    },
    finishTask: {
      type: Sequelize.DATE,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),

  down: queryInterface => queryInterface.dropTable('plan_taskJobs'),
};
