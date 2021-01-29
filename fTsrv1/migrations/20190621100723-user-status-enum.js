

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'users',
    'status',
    {
      type: Sequelize.ENUM('registered', 'active', 'disabled'),
    }
  ),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'users',
    'status',
    {
      type: Sequelize.STRING,
    }
  ).then(() => {
    queryInterface.sequelize.query('drop type "public"."enum_users_status";');
  }),
};
