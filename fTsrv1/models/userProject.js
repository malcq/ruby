module.exports = (sequelize, Sequelize) => {
  const UserProject = sequelize.define('user_project', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    project_id: {
      type: Sequelize.INTEGER,
    },
  });

  return UserProject;
};
