module.exports = (sequelize, Sequelize) => {
  const ArticleTag = sequelize.define('article_tag', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tag_id: {
      type: Sequelize.INTEGER,
    },
    article_id: {
      type: Sequelize.INTEGER,
    },
  });

  return ArticleTag;
};
