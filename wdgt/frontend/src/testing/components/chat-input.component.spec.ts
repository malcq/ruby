import { Component, Input, } from '@angular/core';

import { Message } from '../../app/_models';

@Component({
  selector: 'app-chat-input',
  template: ''
})
export class MockChatInputComponent {
  @Input() message: Message;
  @Input() context: any;
}
