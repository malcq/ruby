module.exports = (sequelize, Sequelize) => {
  const Plan = sequelize.define('plan', {

    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    noteForAdmin: {
      type: Sequelize.TEXT,
    },
    idChain: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
    },
  });

  Plan.associate = (models) => {
    models.plan.belongsToMany(models.user, {
      through: {
        model: models.user_plan,
        unique: false,
      },
      foreignKey: 'plan_id',
    });

    models.plan.belongsToMany(models.taskJob, {
      through: {
        model: models.plan_taskJob,
        unique: false,
      },
      foreignKey: 'plan_id',
    });
  };
  return Plan;
};
