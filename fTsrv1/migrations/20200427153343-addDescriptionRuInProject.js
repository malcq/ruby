
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn('projects', 'description_ru', {
      type: Sequelize.TEXT,
    }),

  down: (queryInterface, Sequelize) => queryInterface
    .removeColumn('projects', 'description_ru', {
      type: Sequelize.TEXT,
    }),
};
