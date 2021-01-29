

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn('requests', 'status', {
    type: Sequelize.ENUM(
      'wait',
      'completed',
      'denied',
      'inProgress',
      'accept'
    ),
  }),

  down: (queryInterface, Sequelize) => queryInterface
    .changeColumn('requests', 'status', {
      type: Sequelize.STRING,
    })
    .then(() => {
      queryInterface.sequelize.query(
        'drop type "public"."enum_requests_status";'
      );
    }),
};
