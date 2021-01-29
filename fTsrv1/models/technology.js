module.exports = (sequelize, Sequelize) => {
  const Technology = sequelize.define('technology', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.TEXT,
      notEmpty: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });

  Technology.associate = (models) => {
    models.technology.belongsToMany(models.project, {
      through: {
        model: models.project_technology,
        unique: false,
      },
      foreignKey: 'technology_id',
    });

    models.technology.belongsTo(models.techGroup, {
      foreignKey: 'group_id',
    });
  };

  return Technology;
};
