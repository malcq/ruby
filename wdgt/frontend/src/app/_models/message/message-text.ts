import { Message } from './message';
import { messageComponentResolver } from './message-component-resolver';
import { MessageComponentInfo } from './message-component-info';
import { ChatItemTextComponent } from '../../components/chat/messages/chat-item-text/chat-item-text.component';

export class MessageText implements Message {
  text: string;
  sender: string;
  fakeBotTypingAnimation: boolean;

  haveInput = true;
  hasAvatar: boolean;

  public static createForUser(text: string): MessageText {
    return new MessageText({text, sender: 'user'});
  }

  constructor(data: any) {
    this.text = data.text;
    this.sender = data.sender;
    this.fakeBotTypingAnimation = data.newMessage && this.sender !== 'user';
    this.hasAvatar = data.firstInSecuence && this.sender !== 'user';
  }

  getServerMessage(): any {
    return {
      type: 'message',
      text: this.text,
      sender: this.sender,
    };
  }

  canSend(): boolean {
    return this.sender === 'user';
  }

  getItemComponent(): MessageComponentInfo {
    return {
      component: ChatItemTextComponent,
      data: {text: this.text, sender: this.sender, fakeBotTypingAnimation: this.fakeBotTypingAnimation}
    };
  }

  getInputComponent(): MessageComponentInfo {
    return null;
  }
}
