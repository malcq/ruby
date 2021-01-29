

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'requests',
    'type',
    {
      type: Sequelize.ENUM('technical', 'vacation', 'medical', 'dayOff'),
    }
  ),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'requests',
    'type',
    {
      type: Sequelize.STRING,
    }
  ).then(() => {
    queryInterface.sequelize.query('drop type "public"."enum_requests_type";');
  }),
};
