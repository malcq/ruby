const { WebClient } = require('@slack/client');
const config = require('../config/index');

class Rtm {
  constructor(token, botname = 'Fusion Dev Bot') {
    this.botname = botname;

    try {
      this.webClient = new WebClient(token);
      console.log(`Slack is running as ${this.botname}`);
    } catch (err) {
      console.log('error', err);
      this.bot = null;
      this.webClient = null;
    }
  }

  async sendToChat(data) {
    const params = {
      type: 'message',
      as_user: false,
      username: this.botname,
      icon_url: config.siteAddress + config.slackBotIconPath,
      ...data,
    };
    if (this.webClient) {
      try {
        const result = await this.webClient.chat.postMessage(params);
        return result;
      } catch (err) {
        console.log(`${this.botname}:channel ${data.channel} sendToChat error ${err.message}`);
        return null;
      }
    }
  }
}

const rtm = new Rtm(config.slackToken, config.slackbot_username);
module.exports = {
  rtm,
};
