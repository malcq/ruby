import { MessageComponentInfo } from './message-component-info';

export interface Message {
  sender: string;
  haveInput: boolean;
  fakeBotTypingAnimation: boolean;
  hasAvatar?: boolean;
  dontShowInHistory?: boolean;

  getServerMessage(): any;
  canSend(): boolean;
  getItemComponent(): MessageComponentInfo;
  getInputComponent(): MessageComponentInfo;
}

export interface MessageAction {
  title: string;
  type: string;
  payload?: any;
}

export interface MessageOption {
  title: string;
}
