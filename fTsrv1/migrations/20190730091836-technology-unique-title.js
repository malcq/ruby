module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'technologies',
    'title',
    {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    }
  ),

  down: (queryInterface, Sequelize) => queryInterface.sequelize.query('ALTER TABLE "technologies" DROP CONSTRAINT title_unique_idx;')
    .then(
      queryInterface.changeColumn(
        'technologies',
        'title',
        {
          type: Sequelize.STRING,
          unique: false,
          allowNull: true,
        }
      )
    ),
};
