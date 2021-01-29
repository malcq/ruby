import { Message } from './message';
import { MessageComponentInfo } from './message-component-info';

export class MessageWaiting implements Message {
  text: string;
  sender: string;

  fakeBotTypingAnimation = false;
  haveInput = false;
  dontShowInHistory = true;

  public static createAnswer(): MessageWaiting {
    return new MessageWaiting({
      sender: 'user',
    });
  }

  constructor(data: any) {
    this.sender = data.sender;
  }

  getServerMessage(): any {
    return {
      type: 'waiting',
      payload: {},
      sender: this.sender,
    };
  }

  canSend(): boolean {
    return this.sender === 'user';
  }

  getItemComponent(): MessageComponentInfo {
    return null;
  }

  getInputComponent(): MessageComponentInfo {
    return null;
  }
}
