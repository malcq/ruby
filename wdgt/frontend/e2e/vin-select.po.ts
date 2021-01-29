import { browser, by, element } from 'protractor';

export class VinSelectPage {
  navigateTo() {
    return browser.get('/vin-select');
  }

  getTitle() {
    return element(by.css('app-fancy-header .fancy-header__title'));
  }

  getVinInput() {
    return element(by.css('form input[name="vin"]'));
  }

  getSubmitButton() {
    return element(by.buttonText('Submit'));
  }
}
