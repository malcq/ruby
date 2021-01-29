const _get = require('lodash/get');
const config = require('../config');

const newAnnouncement = _get(config, 'slackMessages.newAnnouncement', []);

class SlackMessageGenerator {
  static get AnnouncementVariants() {
    return [
      ':mega: Оп-па! Да у нас новое объявление! :conga-parrot:',
      ':male-pilot::skin-tone-2: Ребята, у нас труп! Возможно криминал :gun:',
      ':man-shrugging::skin-tone-2: Никогда такого не было и вот опять :man-facepalming::skin-tone-2:',
      ':crossed_fingers::skin-tone-2: Ну, надеюсь, что хоть это корпоратив... :fiesta_parrot:',
      ...newAnnouncement,
    ];
  }

  static getRandomIndex(max = 0) {
    return Math.floor(Math.random() * max);
  }

  static getRandomItem(arr = []) {
    return arr[SlackMessageGenerator.getRandomIndex(arr.length)];
  }

  static get newAnnouncement() {
    return SlackMessageGenerator.getRandomItem(SlackMessageGenerator.AnnouncementVariants);
  }
}

module.exports = SlackMessageGenerator;
