

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'avatarThumbnail', {
    type: Sequelize.STRING,
  }),

  down: queryInterface => queryInterface.removeColumn('users', 'avatarThumbnail'),
};
