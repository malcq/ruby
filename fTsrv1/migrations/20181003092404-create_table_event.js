

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('events', {
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
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),

  down: queryInterface => queryInterface.dropTable('events'),
};
