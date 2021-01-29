
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('project_technologies', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    technology_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'technologies',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    project_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'projects',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),
  down: queryInterface => queryInterface.dropTable('project_technologies'),
};
