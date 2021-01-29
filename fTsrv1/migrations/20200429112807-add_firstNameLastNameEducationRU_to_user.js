module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'users',
      'firstName_ru',
      {
        type: Sequelize.STRING,
      }
    ),
    queryInterface.addColumn(
      'users',
      'lastName_ru',
      {
        type: Sequelize.STRING,
      }
    ),
    queryInterface.addColumn(
      'users',
      'education',
      {
        type: Sequelize.TEXT,
      }
    ),
    queryInterface.addColumn(
      'users',
      'education_ru',
      {
        type: Sequelize.TEXT,
      }
    ),
  ]),
  down: queryInterface => Promise.all([
    queryInterface.removeColumn('users', 'firstName_ru'),
    queryInterface.removeColumn('users', 'lastName_ru'),
    queryInterface.removeColumn('users', 'education'),
    queryInterface.removeColumn('users', 'education_ru'),
  ]),
};
