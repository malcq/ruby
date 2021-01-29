

module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    message: {
      type: DataTypes.TEXT,
      notEmpty: true,
    },
    files: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    author_id: {
      type: DataTypes.INTEGER,
    },
    crm_tasks_id: {
      type: DataTypes.INTEGER,
    },
  }, {});

  message.associate = (models) => {
    models.message.belongsTo(models.user, {
      foreignKey: 'author_id',
      as: 'author',
    });

    models.message.belongsTo(models.crm_tasks, {
      foreignKey: 'crm_tasks_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    models.message.belongsToMany(models.user, {
      as: 'subscribers',
      through: {
        model: models.messages_user,
        unique: true,
      },
      foreignKey: 'message_id',
      onDelete: 'CASCADE',
    });

    models.message.hasMany(models.messages_user, {
      as: 'message_user_info',
      foreignKey: 'message_id',
    });
  };
  return message;
};
