import { browser } from 'protractor';

export class ContactsPage {
  navigateTo() {
    return browser.get('/contacts/3back');
  }
}
