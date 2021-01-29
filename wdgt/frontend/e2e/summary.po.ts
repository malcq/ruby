import { browser, by, element } from 'protractor';

export class SummaryPage {
  navigateTo() {
    return browser.get('/summary');
  }

  getSendButton() {
    return element(by.partialButtonText('Send'));
  }
}
