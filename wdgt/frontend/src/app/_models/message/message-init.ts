import { Message } from './message';
import { Feedback } from '../feedback';
import { BaseFile, MediaFileType } from '../base-file';
import { MessageComponentInfo } from './message-component-info';

export class MessageInit implements Message {
  text: string;
  sender: string;

  fakeBotTypingAnimation = false;
  haveInput = false;

  public static getChatTagText(feedback: Feedback): string {
    let hasVideo = false;
    let hasPicture = false;
    let hasAudio = false;
    feedback.files.forEach(file => {
      if (file.fileType === MediaFileType.video) {
        hasVideo = true;
      }
      if (file.fileType === MediaFileType.image) {
        hasPicture = true;
      }
      if (file.fileType === MediaFileType.audio) {
        hasAudio = true;
      }
    });
    const initData = {
      'picture': hasPicture ? 'true' : 'false',
      'video': hasVideo ? 'true' : 'false',
      'audio': hasAudio ? 'true' : 'false',
      'car': feedback.productModel.title,
      'start': 'true',
    };
    return JSON.stringify(initData);
  }

  public static createForFeedback(feedback: Feedback): MessageInit {
    return new MessageInit({
      text: MessageInit.getChatTagText(feedback),
      sender: 'user',
    });
  }

  constructor(data: any) {
    this.text = data.text;
    this.sender = data.sender;
  }

  getServerMessage(): any {
    return {
      type: 'init',
      text: this.text,
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
