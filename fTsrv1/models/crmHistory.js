module.exports = (sequelize, DataTypes) => {
  const crm_history = sequelize.define(
    'crm_history',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      event: {
        type: DataTypes.TEXT,
        notEmpty: true,
      },

      moved_to_stage: {
        type: DataTypes.INTEGER,
      },
    },
    {}
  );
  crm_history.associate = (models) => {
    models.crm_history.belongsTo(models.crm_tasks, {
      foreignKey: 'history_in_task',
    });
  };

  return crm_history;
};
