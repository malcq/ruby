import { browser, by, element } from 'protractor';

export class RecordTypePage {
  navigateTo() {
    return browser.get('/record-type');
  }

  getTitle() {
    return element(by.css('app-fancy-header .fancy-header__title'));
  }

  getTextButton() {
    return element(by.css('.capture-button--text'));
  }

  getWalpaper() {
    return element(by.css('.wallpaper img'));
  }
}
