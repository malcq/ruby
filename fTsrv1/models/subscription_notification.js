
module.exports = (sequelize, DataTypes) => {
  const subscription_notification = sequelize.define('subscription_notification', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },

    auth_key: {
      type: DataTypes.STRING,
    },

    subscription: {
      type: DataTypes.JSON,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  subscription_notification.associate = (models) => {
    models.subscription_notification.belongsTo(models.user, {
      foreignKey: 'user_id',
    });
  };
  return subscription_notification;
};
