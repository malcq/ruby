
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('crm_histories', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    event: {
      type: Sequelize.TEXT,
      notEmpty: true,
    },

    history_in_task: {
      type: Sequelize.INTEGER,
      references: {
        model: 'crm_tasks',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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
  down: queryInterface => queryInterface.dropTable('crm_histories'),
};
