module.exports = (sequelize, Sequelize) => {
  const UserPlan = sequelize.define('user_plan', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    plan_id: {
      type: Sequelize.INTEGER,
    },
  });
  return UserPlan;
};
