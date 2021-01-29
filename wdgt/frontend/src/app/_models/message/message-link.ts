import { Message } from './message';
import { messageComponentResolver } from './message-component-resolver';
import { MessageComponentInfo } from './message-component-info';
import { ChatItemLinkComponent } from '../../components/chat/messages/chat-item-link/chat-item-link.component';

export class MessageLink implements Message {
  text: string;
  sender: string;
  link: any;
  fakeBotTypingAnimation = false;
  haveInput = false;
  hasAvatar: boolean;

  constructor(data: any) {
    this.text = data.text;
    this.sender = data.sender;
    this.link = data.payload.link;
    this.hasAvatar = data.firstInSecuence && this.sender !== 'user';
  }

  getServerMessage(): any {
    return null;
  }

  canSend(): boolean {
    return false;
  }

  getItemComponent(): MessageComponentInfo {
    return {
      component: ChatItemLinkComponent,
      data: {text: this.text, sender: this.sender, link: this.link, fakeBotTypingAnimation: this.fakeBotTypingAnimation}
    };
  }

  getInputComponent(): MessageComponentInfo {
    return null;
  }
}
