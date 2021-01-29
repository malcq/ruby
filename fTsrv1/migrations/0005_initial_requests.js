
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('requests', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.TEXT,
    },
    type: {
      type: Sequelize.STRING,
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
      type: Sequelize.STRING,
      notEmpty: true,
      defaultValue: 'wait',
    },
    deniedComment: {
      type: Sequelize.TEXT,
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
  down: queryInterface => queryInterface.dropTable('requests'),
};
