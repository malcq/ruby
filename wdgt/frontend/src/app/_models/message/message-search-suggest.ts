import {
  Message,
  MessageAction,
  MessageOption,
} from './message';
import { messageComponentResolver } from './message-component-resolver';
import { MessageComponentInfo } from './message-component-info';

export class MessageSearchSuggest implements Message {
  text: string;
  defaultValue = '';

  sender: string;

  haveInput = true;

  hasAvatar = false;
  fakeBotTypingAnimation = false;

  dontShowInHistory = false;

  constructor(data: any) {
    this.sender = data.sender;
    if (data.text) {
      this.text = data.text;
      if (data.defaultValue) {
        this.defaultValue = data.defaultValue;
      }
      this.fakeBotTypingAnimation = data.newMessage && this.sender !== 'user';
      this.hasAvatar = data.firstInSecuence && this.sender !== 'user';
    } else {
      this.dontShowInHistory = true;
    }
  }

  getServerMessage(): any {
    return null;
  }

  canSend(): boolean {
    return false;
  }

  getItemComponent(): MessageComponentInfo {
    if (this.dontShowInHistory) {
      return null;
    } else {
      return {
        component: messageComponentResolver.getComponentByname('app-chat-item-search-suggest'),
        data: {text: this.text, sender: this.sender, fakeBotTypingAnimation: this.fakeBotTypingAnimation}
      };
    }
  }

  getInputComponent(): MessageComponentInfo {
    return {
      component: messageComponentResolver.getComponentByname('app-chat-input-search-suggest'),
      data: {fakeBotTypingAnimation: this.fakeBotTypingAnimation, defaultValue: this.defaultValue}
    };
  }
}
