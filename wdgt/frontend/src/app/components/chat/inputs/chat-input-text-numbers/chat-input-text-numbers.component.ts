import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { AutosizeDirective } from '../../../../_directives/auto-size.directive';
import { ChatInputBaseComponent } from '../../chat-view/chat-input-base.component';
import { WidgetService } from '../../../../_services/widget.service';

@Component({
  selector: 'app-chat-input-text-numbers',
  templateUrl: './chat-input-text-numbers.component.html',
  styleUrls: [
    './chat-input-text-numbers.component.css',
    '../../../../fancy.css',
  ]
})
export class ChatInputTextNumbersComponent implements OnInit, AfterViewInit, ChatInputBaseComponent {

  @Input() data: any;
  @Input() context: any;

  @ViewChild(AutosizeDirective) autosizeDirective: AutosizeDirective;

  hide: boolean = false;

  public focus = new EventEmitter<boolean>();

  public message = '';

  constructor(
    private hostRef: ElementRef,
    private widgetService: WidgetService,
  ) { }

  ngOnInit() {
    if(this.context.iphoneScrolling) {
      this.hide = true;
    }
  }

  ngAfterViewInit() {
    if(this.context.iphoneScrolling) {
      const script = (function() {
        const sendMessage: any = window['sendMessage'];
        const message = document.getElementById('message') as HTMLInputElement;
        const send = document.getElementById('send');
        const iDontKnow = document.getElementById('iDontKnow');
        send.addEventListener('click', () => {
          sendMessage({type: 'answer', message: message.value});
        });
        iDontKnow.addEventListener('click', () => {
          sendMessage({type: 'answer', message: 'I don\'t know.'});
        });
        message.addEventListener("keydown", function(event) {
          if (event.key === "Enter") {
            event.preventDefault();
            sendMessage({type: 'answer', message: message.value});
          }
        });
        message.focus();
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
    } else {
      this.focus.emit(true);
    }
  }

  onInputKeyupEnter() {
    this.sendMessage();
  }

  onSendPress() {
    this.sendMessage();
  }

  onIDontKnowPress() {
    this.answer('I don\'t know.');
  }

  sendMessage() {
    this.answer('' + this.message);
  }

  answer(message: string): boolean {
    this.context.sendText(message);
    this.message = '';
    return true;
  }
}
