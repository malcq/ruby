import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ElementRef,
} from '@angular/core';

import { environment } from '../../../../../environments/environment';

import { MessageAction } from '../../../../_models/message';
import { ChatInputBaseComponent } from '../../chat-view/chat-input-base.component';
import { WidgetService } from '../../../../_services/widget.service';

@Component({
  selector: 'app-chat-input-actions',
  templateUrl: './chat-input-actions.component.html',
  styleUrls: ['./chat-input-actions.component.css']
})
export class ChatInputActionsComponent implements OnInit, ChatInputBaseComponent {

  @Input() data: any = {};
  @Input() context: any;

  actions: MessageAction[] = [];

  hide: boolean = false;

  constructor(
    private hostRef: ElementRef,
    private widgetService: WidgetService,
  ) { }

  ngOnInit() {
    this.actions = this.data.actions || [];
    if(this.context.iphoneScrolling) {
      this.hide = true;
    }
  }

  ngAfterViewInit() {
    if(this.context.iphoneScrolling) {
      const script = (function() {
        const sendMessage: any = window['sendMessage'];
        const actions = document.getElementsByClassName('action');
        Array.prototype.forEach.call(actions, (action) => {
            action.addEventListener('click', () => {
              sendMessage({type: 'answer', message: {action: JSON.parse(action.getAttribute('data-action'))}});
            });
        });
      }).toString();

      this.widgetService.showCurrentInput(
        this.hostRef,
        script,
        (answer: any) => {
          const action = answer.message.action;
          if(this.answer(action)) {
            this.widgetService.hideInput();
          }
        }
      );
    }
  }

  onActionPress(action: MessageAction) {
    this.answer(action);
  }

  answer(action: MessageAction): boolean {
    if (action.type === 'done') {
      this.context.done();
    } else if (action.type === 'speak-to-expert') {
      this.context.makeCall(action.payload.phone);
    } else {
      this.context.sendAnswer(action);
    }
    return true;
  }

  stringify(object: any): string {
    return JSON.stringify(object);
  }
}
