const nodemailer = require('nodemailer');

const BaseService = rootRequire('lib/base-service');

/**
 * MailerAdapter
 *
 * Wrapper for standard emails sending
 */
class MailerAdapter extends BaseService {
  /**
   * Initialize mailer transport from options on service start
   *
   * @return  {undefined}
   */
  startService() {
    if (this.transport) {
      throw new Error('MailerAdapter already started');
    }

    this.transport = nodemailer.createTransport(this.options.transport);
  }

  /**
   * Sends combined email
   *
   * @param   {Object}   envelope  The mail content object
   * @return  {Promise}            The promise will be resolved/rejected with a result of sending
   */
  send(envelope) {
    return new Promise((resolve, reject) => {
      this.transport.sendMail({
        ...this.options.mail,
        ...envelope,
      }, (error, info) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(info);
        }
      });
    });
  }
}

module.exports = MailerAdapter;
