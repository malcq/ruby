module.exports = (sequelize, Sequelize) => {
  const Article = sequelize.define('article', {
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING,
    },
    link: {
      type: Sequelize.STRING,
    },
  });

  Article.associate = (models) => {
    models.article.belongsTo(models.user, {
      foreignKey: 'added_by',
    });

    models.article.belongsToMany(models.tag, {
      through: {
        model: models.article_tag,
        as: 'tags',
        unique: false,
      },
      foreignKey: 'article_id',
    });
  };

  return Article;
};
