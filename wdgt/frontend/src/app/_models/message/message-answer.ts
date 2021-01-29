import { Message, MessageAction } from './message';
import { messageComponentResolver } from './message-component-resolver';
import { MessageComponentInfo } from './message-component-info';

export class MessageAnswer implements Message {
  text: string;
  sender: string;
  fakeBotTypingAnimation: boolean;
  type: string;

  haveInput = true;
  hasAvatar: boolean;

  public static createForUser(answer: MessageAction): MessageAnswer {
    return new MessageAnswer({text: answer.title, type: answer.type, sender: 'user'});
  }

  constructor(data: any) {
    this.type = data.type;
    this.text = data.text;
    this.sender = data.sender;
    this.fakeBotTypingAnimation = data.newMessage && this.sender !== 'user';
    this.hasAvatar = data.firstInSecuence && this.sender !== 'user';
  }

  getServerMessage(): any {
    return {
      type: this.type,
      text: this.text,
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
