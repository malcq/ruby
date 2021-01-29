const nodemailer = require('nodemailer');
const config = require('../config');

exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  tls: true,
  auth: {
    user: config.serviceEmail,
    pass: config.servicePassword,
  },
});
