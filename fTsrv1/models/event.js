module.exports = (sequelize, Sequelize) => {
  const Event = sequelize.define('event', {

    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    location: {
      type: Sequelize.STRING,
    },
    images: {
      type: Sequelize.ARRAY(Sequelize.STRING),
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
  });

  Event.associate = (models) => {
    models.event.belongsToMany(models.user, {
      through: {
        model: models.user_event,
        unique: false,
      },
      foreignKey: 'event_id',
    });
  };
  return Event;
};
