module.exports = (sequelize, Sequelize) => {
  const TaskJob = sequelize.define('taskJob', {

    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
      notEmpty: true,
    },
  });

  TaskJob.associate = (models) => {
    models.taskJob.belongsToMany(models.plan, {
      through: {
        model: models.plan_taskJob,
        unique: false,
      },
      foreignKey: 'taskJob_id',
    });
  };

  return TaskJob;
};
