const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const moment = require('moment');
const _ = require('lodash');
const db = require('../models/index');
const hash = require('../utils/hash');
const config = require('../config');
const { transporter } = require('../utils/transporter');
const createToken = require('../utils/createToken');

/**
 * @swagger
 *
 * /api/auth/authorize:
 *   post:
 *     summary: Check authorization cookie
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: user data
 *       404:
 *         description: error no such user
 *       403:
 *         description: Error message, probably wrong request
 */

const authorize = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.cookie, req.secret);
    const user = await db.user.findOne({
      where: { login: decoded.login },
      attributes: {
        exclude: ['password', 'updatedAt'],
      },
    });
    if (!user) {
      return res.status(404).send(false);
    }
    return res.status(200).send(user.get());
  } catch (err) {
    return res.status(403).send(err);
  }
};

/**
 * @swagger
 *
 * /api/auth/password_restore:
 *   post:
 *     summary: Request password restore
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                type: string
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: email have been sent to the email
 *       404:
 *         description: error no such user
 *       403:
 *         description: Error message, probably wrong request
 */

const passwordRestore = async (req, res) => {
  try {
    const user = await db.user.findOne({
      where: { email: req.body.email.trim() },
      attributes: {
        exclude: ['password', 'updatedAt'],
      },
    });
    if (!user) {
      return res.status(404).send('User not found! Bad credentials!');
    }

    const buf = crypto.randomBytes(20);
    const token = buf.toString('hex');
    await user.update({
      resetPasswordToken: token,
      resetPasswordExpires: moment().add(10, 'minutes'),
    });

    const link = `${config.siteAddress}/reset/${token}`;

    const mailOptions = {
      from: config.serviceEmail,
      to: req.body.email,
      subject: 'Restore password',
      html: `<a href=${link}>${link}</a>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(404).send(err.message);
      }
      return res.status(200).send(info);
    });
    return null;
  } catch (err) {
    return res.status(403).send(err);
  }
};

/**
 * @swagger
 *
 * /api/auth/reset/{token}:
 *   post:
 *     summary: reset password
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         description: token generated onRestore
 *       - name: reset pass object
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPass:
 *                type: string
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: password have been changed
 *       400:
 *         description: no token
 *       404:
 *         description: err message. Probably no such user
 */

const passwordReset = async (req, res) => {
  const { token } = req.params;
  const { newPass } = req.body;
  if (!token) {
    return res
      .status(400)
      .message('Token is missing!')
      .send();
  }
  try {
    const user = await db.user.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          $gt: new Date(),
        },
      },
      attributes: {
        exclude: ['password', 'updatedAt'],
      },
    });
    if (!user) {
      return res.status(404).send('Invalid Token!');
    }
    user.update({
      resetPasswordToken: null,
      password: hash(newPass),
    });
    return res.status(200).send('Password changed successfully!');
  } catch (err) {
    return res.status(404).send(err);
  }
};

/**
 * @swagger
 *
 * /api/auth/signin:
 *   post:
 *     summary: log in
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: password have been changed
 *       500:
 *         description: validation errors
 */

const singIn = (req, res) => {
  switch (req.passwordCheck) {
    case null:
      return res.status(500).send('user');

    case false:
      return res.status(500).send('password');

    default:
      const user = req.userData;
      delete user.password;
      const token = createToken(user, req.secret);
      return res.status(200).send({ cookie: `${config.token_name}=${token}; path=/`, user });
  }
};

/**
 * @swagger
 *
 * /api/auth/signup:
 *   post:
 *     summary: register
 *     produces:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                type: string
 *               login:
 *                type: string
 *               password:
 *                type: string
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: password have been changed
 */

const singUp = async (req, res) => {
  try {
    const newUser = req.body;
    newUser.password = hash(newUser.password);

    let user = await db.user.create(newUser);
    user = user.get();
    delete user.password;
    delete user.updatedAt;

    const token = createToken(user, req.secret);
    return res.status(200).send({ cookie: `${config.token_name}=${token}; path=/`, user });
  } catch (err) {
    const errorType = _.get(err, 'errors[0].type', 'Server error');
    const errorPath = _.get(err, 'errors[0].path', 'internal server error');
    const status = _.get(err, 'name') === 'SequelizeValidationError' ? 400 : 500;

    const errorText = `${errorType}: ${errorPath}`;

    console.log('Error in sign-up route:\n', err);
    return res.status(status).send(errorText);
  }
};

module.exports = {
  authorize,
  singIn,
  singUp,
  passwordRestore,
  passwordReset,
};
