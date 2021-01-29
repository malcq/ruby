const Transport = require('winston-transport');
const _find = require('lodash.find');
const { error } = require('../../models');
const { transporter } = require('../transporter');
const { serviceEmail } = require('../../config');

const types = {
  info: 'info',
  error: 'error',
  warn: 'warn',
};

const sendMail = ({ error: errorText, routeName = 'Маршрут не был задан', filename } = {}) => {
  const mailOptions = {
    from: serviceEmail,
    to: serviceEmail,
    subject: `Ошибка в ${filename}`,
    html: `<p> Ошибка произошла по маршруту: ${routeName}</p><p>Текст ошибки: ${errorText}</p>`,
  };
  transporter.sendMail(mailOptions);
};

const createError = data => error.create(data);

const options = {
  actions: [
    {
      type: types.info,
      callbacks: [console.log],
    },
    {
      type: types.warn,
      callbacks: [console.error, createError],
    },
    {
      type: types.error,
      callbacks: [console.error, createError, sendMail],
    },
  ],
};

class CustomTransport extends Transport {
  constructor(opts = options) {
    super(opts);
    this.actions = opts.actions;
  }

  async log({ message, level } = {}) {
    const { callbacks } = _find(this.actions, ['type', level]);
    for (let i = 0; i < callbacks.length; i += 1) {
      try {
        callbacks[i](message);
      } catch (e) {
        console.error('CustomTransport log error, then message:', message);
        console.error('Error', e);
      }
    }
  }
}

module.exports = new CustomTransport();
