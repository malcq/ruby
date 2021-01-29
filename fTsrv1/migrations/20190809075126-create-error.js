module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('errors', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    filename: {
      type: Sequelize.STRING,
    },
    error: {
      type: Sequelize.STRING,
    },
    routeName: {
      type: Sequelize.STRING,
    },
    user: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
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
  down: queryInterface => queryInterface.dropTable('errors'),
};
