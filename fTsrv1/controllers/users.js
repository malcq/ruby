const jwt = require('jsonwebtoken');
const fs = require('fs');
const gm = require('gm').subClass({ imageMagick: true });

const config = require('../config');
const db = require('../models/index');
const hash = require('../utils/hash');
const createToken = require('../utils/createToken');
const { parseStringToArray } = require('../utils/image');
const { updateUserConversationId } = require('../slackBot/usersData');

/**
 * @swagger
 * definitions:
 *   UserModel:
 *     type: object
 *     properties:
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       login:
 *         type: string
 *       info:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       DoB:
 *         type: string
 *         format: date-time
 *       phone:
 *         type: string
 *       slack_name:
 *         type: string
 *       slack_conversational_id:
 *         type: string
 *       slack_conversational_crm_id:
 *         type: string
 *       role:
 *         type: string
 *         enum: ['student', 'user', 'sales', 'admin']
 *       repo:
 *         type: string
 *       resetPasswordExpires:
 *         type: string
 *         format: date-time
 *       resetPasswordToken:
 *         type: string
 *       status:
 *         type: string
 *         enum: ['registered', 'active', 'disabled']
 */

/**
 * @swagger
 *
 * /api/users/{login}:
 *   get:
 *     summary: GET user by login
 *     parameters:
 *       - in: path
 *         name: login
 *         schema:
 *           type: string
 *         description: user's login
 *     tags:
 *       - users
 *     responses:
 *       200:
 *         description: user
 */

const getUser = async (req, res) => {
  /* TODO
  Here is trouble with socket: previous version of code https://gitlab.com/fusion.team.llc/internal-server/blob/e9784b6d51b98c763d6e3342d32b8c1c30599500/controllers/users.js#L13
  leads to error 'TypeError: res.status is not a function'
  The reason comes from sockets/route.js (line 34) where res is not Response object
  */
  const { login } = req.params;
  db.user
    .findOne({
      where: { login },
      attributes: {
        exclude: ['password', 'updatedAt'],
      },
    })
    .then((user) => {
      if (!user) {
        return res.send(null);
      }

      return res.send(user.get());
    })
    .catch((err) => {
      console.error('getUser error', err);
      return res.send(null);
    });
};

/**
 * @swagger
 *
 * /api/users/:
 *   get:
 *     summary: GET filtered and sorted user list
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filter:
 *                 type: object
 *                 description: filter for where
 *                 properties:
 *                   name:
 *                     type: string
 *                   notRole:
 *                     type: string
 *                   status:
 *                     type: string
 *               sort:
 *                 type: array
 *                 collectionFormat: multi
 *                 items:
 *                   type: "string"
 *                 example: [id, asc]
 *               description: sorting parameters
 *         in: body
 *     tags:
 *       - users
 *     responses:
 *       200:
 *         description: user
 */

const getUsers = async (req, res) => {
  const { filter, sort = ['lastName', 'ASC'] } = req.query;

  try {
    const parsedFilter = filter ? JSON.parse(filter) : { notRole: 'student', status: 'active' };

    const users = await db.user.findAll({
      where: makeFilter(parsedFilter),
      order: [sort],
      attributes: [
        'login', 'id', 'avatar', 'avatarThumbnail',
        'firstName', 'lastName', 'email',
        'phone', 'status', 'role',
        'education', 'education_ru',
      ],
    });

    return res.status(200).send(users);
  } catch (err) {
    console.error('getUsers error:', err);
    return res.status(500).send(err.message);
  }
};

/**
 * @swagger
 *
 * /api/users/editUser:
 *   put:
 *     summary: edit user record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/UserModel'
 *     tags:
 *      - users
 *     responses:
 *       200:
 *         description: user updated
 *       500:
 *         description: error message
 *
 */

const editUser = async (req, res) => {
  try {
    if (!req.passwordCheck) {
      throw new Error('Wrong password');
    }
    // If slack_name was changed
    if (req.body.slack_name !== req.userData.slack_name) {
      const { error } = await updateUserConversationId(req, res);
      if (error) {
        throw new Error(error);
      }
    }

    const newData = { ...req.body };
    delete newData.createdAt;

    newData.repo = parseStringToArray(newData.repo);
    if (newData.newLogin) {
      newData.login = newData.newLogin;
    }
    delete newData.newLogin;

    if (newData.newPassword) {
      newData.password = hash(newData.newPassword);
    } else {
      delete newData.password;
    }
    delete newData.newPassword;

    let user = await db.user.update(newData, {
      where: { login: req.userData.login },
      individualHooks: true,
    });
    user = user[1][0].dataValues;

    delete user.password;
    delete user.updatedAt;

    const token = createToken(user, req.secret);

    return res.send({
      cookie: `${config.token_name}=${token};path=/;`,
      user,
      status: '200',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 *
 * /api/users/adminChange/{id}:
 *   put:
 *     summary: edit user record
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: user db Pkey
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *         schema:
 *           $ref: '#/definitions/UserModel'
 *     tags:
 *      - users
 *     responses:
 *       200:
 *         description: user updated
 *       403:
 *         description: invalid token
 *       500:
 *         description: erroe message
 *
 */

const adminChange = async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    jwt.verify(data.cookie, req.secret);
    delete data.cookie;
    await db.user.update(data, {
      where: { id },
      individualHooks: true,
    });
    return res.status(200).send('success');
  } catch (err) {
    return res.status(403).send('access error');
  }
};

const newAvatar = (req, res) => {
  const avatar = `public/uploads/${req.file.filename}`;
  const login = req.params.id;
  const oldPath = `public/uploads/${req.body.avatar.split('/').splice(-1, 1)}`;

  const thumbnailPath = `${oldPath}_thumbnail`;
  if (fs.existsSync(oldPath)) {
    fs.unlinkSync(oldPath);
  }
  if (fs.existsSync(thumbnailPath)) {
    fs.unlinkSync(thumbnailPath);
  }

  const avatarPath = `/public/uploads/${req.file.filename}`;

  gm(avatar)
    .quality(20)
    .write(avatar, (err) => {
      if (err) {
        console.error(err);
      }
      gm(avatar)
        .resize(130, 130)
        .write(`${avatar}_thumbnail`, (error) => {
          if (!error) {
            savePathsInDatabase(true);
          } else {
            savePathsInDatabase(false);
            console.log(error);
          }
        });
    });

  async function savePathsInDatabase(wasThumbnailCreated) {
    try {
      let user = await db.user.update(
        {
          avatar: avatarPath,
          avatarThumbnail: wasThumbnailCreated ? `${avatarPath}_thumbnail` : null,
        },
        {
          where: { login },
          individualHooks: true,
        }
      );

      user = user[1][0].dataValues;

      delete user.password;

      const token = createToken(user, req.secret);
      return res.send({ cookie: `${config.token_name}=${token}; path=/`, user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

const makeFilter = (filter = {}) => {
  const filterParams = {};
  const namePattern = { $iLike: `%${filter.name}%` };
  if (filter.name) {
    filterParams.$or = [
      { login: namePattern },
      { firstName: namePattern },
      { lastName: namePattern },
    ];
  }
  if (filter.notRole) {
    filterParams.role = { [db.Sequelize.Op.not]: filter.notRole };
  }
  if (filter.status) {
    filterParams.status = filter.status;
  }
  return filterParams;
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await db.user.destroy({ where: { id: userId } });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUser,
  getUsers,
  editUser,
  adminChange,
  newAvatar,
  deleteUser,
};
