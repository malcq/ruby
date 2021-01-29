const _defaultsDeep = require('lodash/defaultsDeep');

const defaultsConfig = require('./defaultConfig.json');

const env = process.env.NODE_ENV || 'development';
let localConfig;
try {
  // eslint-disable-next-line global-require
  localConfig = require('./local.config');
} catch (err) {
  localConfig = {};
  console.error('Local config not found');
}

const config = _defaultsDeep(localConfig, defaultsConfig)[env];

module.exports = config;
