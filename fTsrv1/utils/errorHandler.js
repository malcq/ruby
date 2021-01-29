const path = require('path');
const Transport = require('winston-transport');
const winston = require('winston');
const moment = require('moment');

const db = require('../models');

const { format } = winston;
const {
  combine,
  timestamp,
  printf,
  colorize,
  prettyPrint,
} = format;

module.exports = () => {
  /**
  * examines the call stack and returns a string indicating
  * the file and line number of the n'th previous ancestor call.
  *
  * @param numberOfCalls : int (default: n=1) - the number of calls to trace up the
  *   stack from the current call.  `n=0` gives you your current file/line.
  *  `n=1` gives the file/line that called you.
  */
  function traceCaller(numberOfCalls, stack) {
    let n;
    if (numberOfCalls === undefined || numberOfCalls < 0) n = 1;
    n = numberOfCalls + 1;
    let line = stack.split('\n')[n];
    const start = line.indexOf('(/');
    line = line.substring(start + 1, line.length - 1);
    const baseDir = path.join(__dirname, '../');
    if (line.indexOf(baseDir) > -1) {
      return line.replace(baseDir, '');
    }
    return line;
  }

  const consoleFormat = printf(info => `>>> ${info.level}: ${info.message} (${moment().format('YYYY-MM-DD HH:mm:ss')})`);

  const silentConsoleFormat = printf(() => '');

  const fileFormat = printf(info => `(${moment().format('YYYY-MM-DD HH:mm:ss')}) ${info.level}: ${info.message}`);

  class DBTransport extends Transport {
    constructor(opts) {
      super(opts);
      this.level = opts.level;
    }

    log(info, callback) {
      const data = info.message.split('|');
      db.error_log.create({
        path: data[0], message: data[1], level: this.level,
      }).then(() => callback());
    }
  }

  const winstonLogger = winston.createLogger({
    format: combine(
      timestamp(),
      fileFormat
    ),
    transports: [],
  });

  if (process.env.NODE_ENV === 'test') {
    winstonLogger.add(new winston.transports.Console({
      silent: true,
      format: combine(silentConsoleFormat),
    }));
  } else {
    winstonLogger.add(
      new DBTransport({ level: 'error' }),
      new winston.transports.File({ level: 'warn', filename: 'combined.log' })
    );
    if (process.env.NODE_ENV !== 'production') {
      winstonLogger.add(new winston.transports.Console({
        format: combine(
          colorize(),
          prettyPrint(),
          consoleFormat
        ),
      }));
    }
  }

  return {
    error: (msg) => {
      const tracePath = traceCaller(1, new Error().stack);
      return winstonLogger.error(`${tracePath}|${msg}`);
    },
    info: (msg) => {
      const tracePath = traceCaller(1, new Error().stack);
      return winstonLogger.info(`${tracePath}|${msg}`);
    },
    warn: (msg) => {
      const tracePath = traceCaller(1, new Error().stack);
      return winstonLogger.warn(`${tracePath}|${msg}`);
    },
  };
};
