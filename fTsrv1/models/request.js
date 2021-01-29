module.exports = (sequelize, Sequelize) => {
  const Request = sequelize.define('request', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    title: {
      type: Sequelize.TEXT,
    },
    type: {
      type: Sequelize.ENUM('technical', 'vacation', 'medical', 'dayOff', 'common', 'documents'),
      notEmpty: true,
    },
    dateFrom: {
      type: Sequelize.DATE,
    },
    dateTo: {
      type: Sequelize.DATE,
    },
    dates: {
      type: Sequelize.ARRAY(Sequelize.DATE),
    },
    comment: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.ENUM('wait', 'completed', 'denied', 'inProgress', 'accept'),
      notEmpty: true,
      defaultValue: 'wait',
    },
    deniedComment: {
      type: Sequelize.TEXT,
    },
    rest_days_number: {
      type: Sequelize.INTEGER,
    },
  });

  Request.associate = (models) => {
    models.request.belongsToMany(models.user, {
      through: {
        model: models.request_user,
        unique: false,
      },
      foreignKey: 'request_id',
    });

    models.request.belongsTo(models.user, {
      as: 'admin_who_updated_id',
      foreignKey: 'updated_by',
    });
  };

  return Request;
};
