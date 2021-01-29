import { Message, MessageAction } from './message';
import { messageComponentResolver } from './message-component-resolver';
import { MessageComponentInfo } from './message-component-info';

export class MessageAnswerSuggestion implements Message {
  text: string;
  data: string;
  sender: string;
  fakeBotTypingAnimation: boolean;

  haveInput = false;
  hasAvatar: boolean;

  public static createForUser(text: string, categories: string): MessageAnswerSuggestion {
    return new MessageAnswerSuggestion({text, data: categories, sender: 'user'});
  }

  constructor(data: any) {
    this.text = data.text;
    this.data = data.data;
    this.sender = data.sender;
    this.fakeBotTypingAnimation = data.newMessage && this.sender !== 'user';
    this.hasAvatar = data.firstInSecuence && this.sender !== 'user';
  }

  getServerMessage(): any {
    return {
      type: 'answer-suggestion',
      text: this.text,
      data: this.data,
      sender: this.sender,
    };
  }

  canSend(): boolean {
    return this.sender === 'user';
  }

  getItemComponent(): MessageComponentInfo {
    return {
      component: messageComponentResolver.getComponentByname('app-chat-item-text'),
      data: {text: this.text, sender: this.sender, fakeBotTypingAnimation: this.fakeBotTypingAnimation}
    };
  }

  getInputComponent(): MessageComponentInfo {
    return null;
  }
}
