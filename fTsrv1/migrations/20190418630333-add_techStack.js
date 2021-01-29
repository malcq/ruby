

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('technologies', 'type', {
    type: Sequelize.ENUM,
    values: ['Front-End', 'Back-End', 'DataBases', 'Other'],
    defaultValue: 'Other',
  }),

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('technologies', 'type', {
      type: Sequelize.ENUM,
      values: ['Front-End', 'Back-End', 'DataBases', 'Other'],
      defaultValue: 'Other',
    });
    return queryInterface.sequelize.query(
      'DROP TYPE "enum_technologies_type";'
    );
  },
};
