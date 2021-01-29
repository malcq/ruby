import { Component, Input, } from '@angular/core';

import { Message } from '../../app/_models';

@Component({
  selector: 'app-chat-view',
  template: ''
})
export class MockChatViewComponent {
  @Input() messages: Message[] = [];
  @Input() lastMessage: Message;
  @Input() context: any;
}
