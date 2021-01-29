

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'users',
    'role',
    {
      type: Sequelize.ENUM('student', 'user', 'sales', 'admin'),
    }
  ),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'users',
    'role',
    {
      type: Sequelize.STRING,
    }
  ).then(() => {
    queryInterface.sequelize.query('drop type "public"."enum_users_role";');
  }),
};
