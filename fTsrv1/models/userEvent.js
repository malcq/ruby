module.exports = (sequelize, Sequelize) => {
  const UserEvent = sequelize.define('user_event', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    event_id: {
      type: Sequelize.INTEGER,
    },
  });

  return UserEvent;
};
