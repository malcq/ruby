import { browser, by, element } from 'protractor';

export class LoginPage {
  navigateTo() {
    return browser.get('/login');
  }

  getFirstTitle() {
    return element
      .all(by.css('app-welcome-slider app-welcome-slider-page'))
      .get(0)
      .element(by.css('app-fancy-header .fancy-header__title'));
  }

  getStartButton() {
    return element(by.buttonText('Get started'));
  }
}
