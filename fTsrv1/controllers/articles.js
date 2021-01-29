const axios = require('axios');
const db = require('../models');
const config = require('../config');
const { rtm } = require('../slackBot/index');

const { Op } = db.Sequelize;

/**
 * @swagger
 * definitions:
 *   createArticleModel:
 *     type: object
 *     properties:
 *       link:
 *         type: string
 *       tags:
 *         type: array
 *         collectionFormat: multi
 *         items:
 *           type: object
 *           properties:
 *             value:
 *               type: string
 *             label:
 *               type: string
 *             __isNew__:
 *               type: boolean
 */

/**
 * @swagger
 *
 * /api/articles/:
 *   get:
 *     summary: GET all articles
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *           example: {"title": "string"}
 *         description: filter for where
 *     tags:
 *       - articles
 *     responses:
 *       200:
 *         description: articles
 *       500:
 *         description: Error message. Probably invalid request data
 */

const getArticles = async (req, res) => {
  const filter = req.query.filter ? JSON.parse(req.query.filter) : '';
  const { users, tags } = filter;
  try {
    let articles = await db.article.findAll({
      where: makeFilterArticles(filter),
      include: [
        {
          model: db.user,
          required: users === undefined ? false : !!users.length,
          where: makeFilterUsers(users),
          attributes: ['id', 'login', 'firstName', 'lastName'],
        },
        {
          model: db.tag,
          required: tags === undefined ? false : !!tags.length,
          where: makeFilterTags(tags),
          attributes: ['id', 'title'],
        },
      ],
    });
    const arrayFilter = [];
    articles.forEach((el) => {
      arrayFilter.push(el.id);
    });
    articles = await db.article.findAll({
      where: { id: arrayFilter },
      include: [
        {
          model: db.user,
          required: false,
          attributes: ['id', 'login', 'firstName', 'lastName'],
        },
        {
          model: db.tag,
          required: false,
          attributes: ['id', 'title'],
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    return res.json({ articles });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/articles/:
 *   post:
 *     summary: Create new article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/createArticleModel'
 *         description: New article object
 *     tags:
 *       - articles
 *     responses:
 *       200:
 *         description: Article created
 *       500:
 *         description: Error message. Probably invalid request data
 *       424:
 *         description: Invalid URL
 */

const postArticle = async (req, res) => {
  const { link, tags } = req.body;
  try {
    for (let i = 0; i < tags.length; i += 1) {
      if (!tags[i].__isNew__) {
        tags[i] = +tags[i].value;
        // eslint-disable-next-line no-continue
        continue;
      }
      const createdTag = await db.tag.create({ title: tags[i].label });
      tags[i] = createdTag.dataValues.id;
    }
    const linkInfo = await axios.get(config.linkpreviewUrl, {
      params: {
        key: config.linkpreviewApiKey,
        q: link,
      },
    });
    if (linkInfo.error) {
      return res.status(400).json({
        error: true,
        message: `Linkpreivew error: ${linkInfo.description}`,
      });
    }
    const linkDesc = linkInfo.data.description;
    if (linkDesc.length >= 166) {
      linkInfo.data.description = `${linkInfo.data.description.slice(0, 166)}...`;
    }
    if (linkDesc[linkDesc.length - 1] !== '.') {
      linkInfo.data.description = `${linkInfo.data.description.slice(0, 166)}...`;
    }
    const matches = link.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
    const domain = matches && matches[1];

    let article = await db.article.create({
      ...linkInfo.data,
      link,
      url: domain,
      added_by: req.user.id,
    });
    if (tags.length) {
      await article.setTags(tags);
    }
    article = await db.article.findById(article.id, {
      include: [
        {
          model: db.tag,
          attributes: ['id', 'title'],
        },
        {
          model: db.user,
          attributes: ['firstName', 'lastName'],
        },
      ],
    });

    const data = {
      channel: config.learningChannelId,
      text: `Внимание! :boom: Свежая пища для мозга уже в разделе Cтатьи! Читай пока актуально :coffee: ${link}`,
    };

    await rtm.sendToChat(data);

    return res.json({ error: false, message: 'New article was successfully added', article });
  } catch (err) {
    return res.status(500).json({ error: true, oops: true, message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/articles/{id}:
 *   delete:
 *     summary: Delete article
 *     produces:
 *       - application/json
 *     parameters:
 *       - in:  path
 *         name: id
 *         description: article db PK
 *         required: true
 *         schema:
 *           type: number
 *     tags:
 *       - articles
 *     responses:
 *       200:
 *         description: article deleted
 *       500:
 *         description: Error message. Probably invalid request data
 */

const deleteArticle = async (req, res) => {
  try {
    await db.article.destroy({ where: { id: req.params.id } });
    const articles = await db.article.findAll({
      include: [
        {
          model: db.user,
          required: false,
          attributes: ['id', 'login', 'firstName', 'lastName'],
        },
        {
          model: db.tag,
          required: false,
          attributes: ['id', 'title'],
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    return res.json({ articles });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const makeFilterArticles = (filter) => {
  let filterParams = {};
  if (filter.title) {
    filterParams = [
      {
        title: {
          [Op.iLike]: `%${filter.title}%`,
        },
      },
    ];
  }
  return filterParams;
};

const makeFilterUsers = (filter) => {
  const filterParams = {};
  if (filter === undefined) {
    return filterParams;
  }
  if (filter.length) {
    filterParams.id = {
      [Op.in]: filter,
    };
  }

  return filterParams;
};

const makeFilterTags = (filter) => {
  const filterParams = {};
  if (filter === undefined) {
    return filterParams;
  }
  if (filter.length) {
    filterParams.id = {
      [Op.in]: filter,
    };
  }

  return filterParams;
};

module.exports = {
  getArticles,
  postArticle,
  deleteArticle,
};
