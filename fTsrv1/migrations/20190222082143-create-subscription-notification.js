
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('subscription_notifications', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    auth_key: {
      type: Sequelize.STRING,
    },
    subscription: {
      type: Sequelize.JSON,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
  down: queryInterface => queryInterface.dropTable('subscription_notifications'),
};
