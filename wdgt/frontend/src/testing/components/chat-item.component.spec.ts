import { Component, Input, } from '@angular/core';

import { Message } from '../../app/_models';

@Component({
  selector: 'app-chat-item',
  template: ''
})
export class MockChatItemComponent {
  @Input() message: Message;
}
