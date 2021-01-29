import { browser, by, element } from 'protractor';

export class FeedbackTypeSelectPage {
  navigateTo() {
    return browser.get('/feedback-type-select');
  }

  getTitle() {
    return element(by.css('app-fancy-header .fancy-header__title'));
  }

  getModelCard() {
    return element(by.css('.model-card'));
  }

  getIssueButton() {
    return element.all(by.css('.type-buttons__button')).get(0);
  }
}
