import { Message } from './message';
import { messageComponentResolver } from './message-component-resolver';
import { MessageComponentInfo } from './message-component-info';

export class MessageEmailConfirm implements Message {
  text: string;
  sender: string;
  fakeBotTypingAnimation: boolean;

  haveInput = false;

  public static create(text: string): MessageEmailConfirm {
    return new MessageEmailConfirm({
      text,
      sender: 'user',
    });
  }

  constructor(data: any) {
    this.text = data.text;
    this.sender = data.sender;
    this.fakeBotTypingAnimation = false;
  }

  getServerMessage(): any {
    return {
      type: 'email-confirm',
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
