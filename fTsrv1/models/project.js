module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define('project', {

    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    title: {
      type: Sequelize.STRING,
      notEmpty: true,
    },
    images: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    href: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    description_ru: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.ARRAY(Sequelize.JSON),
    },
  });

  Project.associate = (models) => {
    models.project.belongsToMany(models.user, {
      through: {
        model: models.user_project,
        unique: false,
      },
      foreignKey: 'project_id',

    });

    models.project.belongsToMany(models.technology, {
      through: {
        model: models.project_technology,
        unique: false,
      },
      foreignKey: 'project_id',
    });
  };

  return Project;
};
