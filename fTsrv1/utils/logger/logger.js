const winston = require('winston');
const transport = require('./transport');

class Logger {
  constructor(transports = [transport]) {
    this.winston = winston.createLogger({ transports });
  }

  getFilename() {
    const { stack } = Error('Ooops');
    const errorString = stack.split('\n')[2];
    /* eslint-disable  no-useless-escape */
    return errorString.match(/(?<=\()(.*?)(?=\:)/)[0];
  }

  /**
   *
   * @param msg {error, routeName, user}
   */
  error(msg) {
    msg.filename = this.getFilename();
    this.winston.error(msg);
  }

  /**
   *
   * @param msg {error, routeName, user}
   */
  warning(msg) {
    msg.filename = this.getFilename();
    this.winston.warn(msg);
  }

  /**
   *
   * @param msg {error, routeName, user}
   */
  info(msg) {
    msg.filename = this.getFilename();
    this.winston.info(msg);
  }
}

module.exports = new Logger();
