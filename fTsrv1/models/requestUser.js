module.exports = (sequelize, Sequelize) => {
  const RequestUser = sequelize.define('request_user', {

    user_id: {
      type: Sequelize.INTEGER,
    },
    request_id: {
      type: Sequelize.INTEGER,
    },
  });

  return RequestUser;
};
