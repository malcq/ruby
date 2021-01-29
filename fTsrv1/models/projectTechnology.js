module.exports = (sequelize, Sequelize) => {
  const ProjectTechnology = sequelize.define('project_technology', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    technology_id: {
      type: Sequelize.INTEGER,
    },
    project_id: {
      type: Sequelize.INTEGER,
    },
  });

  return ProjectTechnology;
};
