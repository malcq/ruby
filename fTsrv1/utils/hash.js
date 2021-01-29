const crypto = require('crypto');
const config = require('../config/index');

module.exports = password => crypto.createHmac(config.hashType, config.hashKey).update(password).digest('hex');
