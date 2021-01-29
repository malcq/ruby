import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';

import {
  messageComponentResolver,
} from '../../../../_models/message';

import { ChatInputBaseComponent } from '../../chat-view/chat-input-base.component';
import { WidgetService } from '../../../../_services/widget.service';

interface Data {
  selectOptions: any[];
  actions: any[];
}

interface Option {
  title: string;
}

@Component({
  selector: 'app-chat-input-selector',
  templateUrl: './chat-input-selector.component.html',
  styleUrls: [
    './chat-input-selector.component.css',
    '../../../../fancy.css',
  ]
})
export class ChatInputSelectorComponent implements OnInit, ChatInputBaseComponent {
  @Input() data: Data = {
    selectOptions: [],
    actions: []
  };

  @Input() context;

  public options: Option[];
  public actions: any[];

  public selectedValue = '';

  hide: boolean = false;

  constructor(
    private hostRef: ElementRef,
    private widgetService: WidgetService,
  ) { }

  ngOnInit() {
    const {
      actions = [],
      selectOptions = [],
    } = this.data;

    this.actions = actions;
    this.options = selectOptions;
    if(this.context.iphoneScrolling) {
      this.hide = true;
    }
  }

  ngAfterViewInit() {
    if(this.context.iphoneScrolling) {
      const script = (function() {
        const sendMessage: any = window['sendMessage'];
        const message = document.getElementById('message') as HTMLSelectElement;
        const send = document.getElementById('send');
        send.addEventListener('click', () => {
          sendMessage({type: 'answer', message: message.value});
        });
        const actions = document.getElementsByClassName('fancy-action');
        Array.prototype.forEach.call(actions, (action) => {
            action.addEventListener('click', () => {
              sendMessage({type: 'answer', message: action.getAttribute('data-actionTitle')});
            });
        });
      }).toString();

      this.widgetService.showCurrentInput(
        this.hostRef,
        script,
        (answer: any) => {
          const message = answer.message;
          if(this.answer(message)) {
            this.widgetService.hideInput();
          }
        }
      );
    }
  }

  onActionPress(action) {
    this.answer(action.title);
  }

  onSelectorSend() {
    this.answer(this.selectedValue);
  }

  answer(message: string): boolean {
    if (!message) { return false; }
    const trimmedMessage = message.trim();
    if (!trimmedMessage) { return false; }
    this.context.sendText(message);
    return true;
  }
}

messageComponentResolver.addComponent(
  'app-chat-input-selector',
  ChatInputSelectorComponent
);
