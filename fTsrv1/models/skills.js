
module.exports = (sequelize, DataTypes) => {
  const skills = sequelize.define('skills', {
    name: DataTypes.STRING,
  }, {});

  return skills;
};
