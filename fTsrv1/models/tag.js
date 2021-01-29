module.exports = (sequelize, Sequelize) => {
  const Tag = sequelize.define('tag', {

    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    title: {
      type: Sequelize.TEXT,
      notEmpty: true,
    },
  });

  Tag.associate = (models) => {
    models.tag.belongsToMany(models.article, {
      through: {
        model: models.article_tag,
        unique: false,
      },
      foreignKey: 'tag_id',
    });
  };

  return Tag;
};
