import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
} from '@angular/core';

import {
  trigger,
  style,
  animate,
  transition,
  sequence,
  query,
  group,
} from '@angular/animations';

import { ChatBaseComponent } from '../../chat-view/chat-base.component';

import { CHAT_ANIMATION_CONFIG } from '../../../../config/chat';
import { messageComponentResolver } from '../../../../_models/message/message-component-resolver';

const loadingMessageAnimation = trigger('loadingMessage', [
  transition('* => void', [
    style({
      opacity: 0,
    }),
    animate('0.1ms ease-out')
  ]),
]);

const messageAnimationBot = trigger('readyMessage', [
  transition('void => bot', [
    style({
      overflow: 'hidden',
    }),
    query('.message__content', style({ opacity: 0 })),
    sequence([
      style({
        width: '0px',
        height: '17px',
      }),
      animate(CHAT_ANIMATION_CONFIG.MESSAGE_TRANSFORM_FROM_TYPING_TIME, style({
        height: '*',
        width: '*',
      })),
      group([
        query(
          '.message__content',
          animate(CHAT_ANIMATION_CONFIG.MESSAGE_CONTENT_FILL_TIME, style({ opacity: 1 }))
        )
      ])
    ]),
  ]),

  transition('void => user', [
    style({
      overflow: 'hidden',
    }),
    query('.message__content', style({ opacity: 0 })),
    sequence([
      group([
        query('.message__content', animate(
          CHAT_ANIMATION_CONFIG.MESSAGE_CONTENT_FILL_TIME,
          style({ opacity: 1 }))
        )
      ])
    ]),
  ]),
]);

@Component({
  selector: 'app-chat-item-search-suggest',
  templateUrl: './chat-item-search-suggest.component.html',
  styleUrls: ['./chat-item-search-suggest.component.css'],
  animations: [
    messageAnimationBot,
    loadingMessageAnimation,
  ]
})
export class ChatItemSearchSuggestComponent implements OnInit, ChatBaseComponent {
  @Input() data: any = {text: ''};

  public loading: boolean;
  public messageVisible: boolean;
  public suggestShowed = false;

  /**
   * Show message by left / right side
   */
  leftSide = true;

  constructor(
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.leftSide = this.data.sender === 'bot';
    const ownMessage = this.isOwnMessage();
    if (ownMessage || !this.data.fakeBotTypingAnimation) {
      this.loading = false;
      this.messageVisible = true;
      return;
    }

    this.loading = true;

    /**
     * Set timeout for imitating bot typing on frontend
     * TODO: remove when api will be capable to typing
     */
    setTimeout(() => {
      this.loading = false;

      /**
       * Because of ExpressionChangedAfterItHasBeenCheckedError,
       * we should ask angular to recalculate changes for scrollTop
       */
      this.changeDetector.detectChanges();
    }, CHAT_ANIMATION_CONFIG.FAKE_TYPE_TIME);
  }

  private isOwnMessage(): boolean {
    return this.data.sender === 'user';
  }
}

messageComponentResolver.addComponent('app-chat-item-search-suggest', ChatItemSearchSuggestComponent);
