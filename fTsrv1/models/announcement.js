
module.exports = (sequelize, Sequelize) => {
  const Announcement = sequelize.define('announcement', {
    title: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
    hidden: { type: Sequelize.BOOLEAN },
    images: { type: Sequelize.ARRAY(Sequelize.STRING) },
    visitDate: { type: Sequelize.DATE },

  }, {});
  Announcement.associate = (models) => {
    models.announcement.belongsTo(models.user, { foreignKey: 'author_id', targetKey: 'id' });
  };
  return Announcement;
};
