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
  selector: 'app-chat-input-text',
  templateUrl: './chat-input-text.component.html',
  styleUrls: [
    './chat-input-text.component.css',
    '../../../../fancy.css',
  ]
})
export class ChatInputTextComponent implements OnInit, AfterViewInit, ChatInputBaseComponent {

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
        const message = document.getElementById('message') as HTMLTextAreaElement;
        const send = document.getElementById('send');
        send.addEventListener('click', () => {
          sendMessage({type: 'answer', message: message.value});
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

  sendMessage() {
    this.answer(this.message);
  }

  answer(message: string): boolean {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) { return false; }
    this.context.sendText(message);
    this.message = '';

    /**
     * We should wait angular to update input and resize it after,
     * because of change detector works we do this async.
     *
     * Remove this if you know better sync method
     */
    setTimeout(() => {
      this.autosizeDirective.resize();
    }, 0);
    return true;
  }
}
