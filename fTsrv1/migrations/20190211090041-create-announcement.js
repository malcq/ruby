
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('announcements', {
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
    description: {
      type: Sequelize.TEXT,
    },
    hidden: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    images: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },

    author_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    visitDate: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
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
  down: queryInterface => queryInterface.dropTable('announcements'),
};
