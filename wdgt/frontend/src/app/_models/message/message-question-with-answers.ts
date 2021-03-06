import {
  Message,
  MessageAction
} from './message';
import { messageComponentResolver } from './message-component-resolver';
import { MessageComponentInfo } from './message-component-info';
import { ChatInputActionsComponent } from '../../components/chat/inputs/chat-input-actions/chat-input-actions.component';

export class MessageQuestionWithAnswers implements Message {
  text: string;

  sender: string;
  actions: MessageAction[];

  haveInput = true;

  hasAvatar = false;
  fakeBotTypingAnimation = false;

  dontShowInHistory = false;

  constructor(data: any) {
    this.sender = data.sender;
    if (data.payload) {
      this.actions = data.payload.actions;
    } else {
      this.actions = data.actions || [];
    }

    if (data.text) {
      this.text = data.text;
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
        component: messageComponentResolver.getComponentByname('app-chat-item-text'),
        data: {text: this.text, sender: this.sender, fakeBotTypingAnimation: this.fakeBotTypingAnimation}
      };
    }
  }

  getInputComponent(): MessageComponentInfo {
    return {
      component: ChatInputActionsComponent,
      data: {text: this.text, sender: this.sender, actions: this.actions, fakeBotTypingAnimation: this.fakeBotTypingAnimation}
    };
  }
}
