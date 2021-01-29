import { browser, by, element } from 'protractor';

export class FinalPage {
  navigateTo() {
    return browser.get('/final');
  }

  getNameTitle() {
    return element(by.css('div.final-message__title.fancy-header__title--blue'));
  }
}
