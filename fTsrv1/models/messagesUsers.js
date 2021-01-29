

module.exports = (sequelize, DataTypes) => {
  const messages_user = sequelize.define('messages_user', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    readed_date: {
      type: DataTypes.DATE,
    },
  }, {});

  messages_user.associate = (models) => {
    models.messages_user.belongsTo(models.message, {
      foreignKey: 'message_id',
    });
  };
  return messages_user;
};
