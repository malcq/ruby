module.exports = (sequelize, Sequelize) => {
  const PlanTaskJob = sequelize.define('plan_taskJob', {
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
      type: Sequelize.STRING,
    },
    startTask: {
      type: Sequelize.DATE,
    },
    finishTask: {
      type: Sequelize.DATE,
    },
  });
  return PlanTaskJob;
};
