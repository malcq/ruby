import { browser, by, element } from 'protractor';

export class ChatPage {
  navigateTo() {
    return browser.get('/chat');
  }

  getMessagesList() {
    return element(by.css('div.messages'));
  }

  getAvatar() {
    return element(by.css('.message--with-avatar .avatar'));
  }

  getSAndSPlace() {
    return element(by.css('app-chat-input-search-suggest'));
  }

  getSAndSInput() {
    return element(by.css('app-chat-input-search-suggest textarea'));
  }

  getSuggestFirstValue() {
    return element.all(by.css('app-chat-input-search-suggest .tag-selector .tag-selector__item-content')).get(0);
  }

  getSendButton() {
    return element(by.buttonText('send'));
  }

  getNoChatButton() {
    return element(by.cssContainingText('app-chat-input-actions div.actions div.action', 'No'));
  }

  getDontKnowChatButton() {
    return element(by.cssContainingText('app-chat-input-selector button', 'Dont know'));
  }

  getChatInput() {
    return element(by.css('app-chat-input-text textarea'));
  }

  getExtraInfoInput() {
    return element(by.css('app-chat-input-extra-info input'));
  }

  getDoneButton() {
    return element(by.cssContainingText('app-chat-input-actions div.actions div.action', 'Done'));
  }
}
