
module.exports = (sequelize, DataTypes) => {
  const extraHours = sequelize.define('extraHours', {
    date: DataTypes.DATE,
    description: DataTypes.TEXT,
    start: DataTypes.STRING,
    end: DataTypes.STRING,
  }, {});

  extraHours.associate = (models) => {
    models.extraHours.belongsTo(models.project, { foreignKey: 'project_id', targetKey: 'id' });
    models.extraHours.belongsTo(models.user, { foreignKey: 'user_id', targetKey: 'id' });
  };

  return extraHours;
};
