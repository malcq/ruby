

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('crm_columns', {

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

    idChain: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: false,
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
  down: queryInterface => queryInterface.dropTable('crm_columns'),
};
