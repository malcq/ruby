
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('techGroups', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.STRING,
      notEmpty: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }).then(() => queryInterface.addColumn(
    'technologies',
    'group_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'techGroups',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    }
  ).then(() => queryInterface.removeColumn('technologies', 'type'))),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('techGroups').then(() => queryInterface.removeColumn('technologies', 'group_id').then(() => queryInterface.addColumn(
    'technologies',
    'type', {
      type: Sequelize.TEXT,
      unique: true,
    }
  ))),
};
