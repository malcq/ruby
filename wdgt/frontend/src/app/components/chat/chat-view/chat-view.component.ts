import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

import {
  trigger,
  style,
  animate,
  transition,
  group,
} from '@angular/animations';

import { Message } from '../../../_models/message';
import { CHAT_ANIMATION_CONFIG } from '../../../config/chat';
import {
  AlertService,
  CompanyService,
} from '../../../_services';

const avatarAnimation = trigger('avatar', [
  transition('void => bot' , [
    style({
      opacity: 0,
      transform: 'scale(0.8)',
    }),
    animate(
      CHAT_ANIMATION_CONFIG.AVATAR_ANIMATION,
      style({
        opacity: 1,
        transform: 'scale(1)'
      })
    ),
  ])
]);

const messageAnimation = trigger('message', [
  transition('void => bot', [
    style({
      opacity: 0,
      transform: 'translateX(-100%)',
    }),
    group([
      animate(
        `${CHAT_ANIMATION_CONFIG.FLY_IN_MESSAGE_TIME_BOT}ms ${CHAT_ANIMATION_CONFIG.FLY_IN_MESSAGE_DELAY_BOT + 300}ms`,
        style({
          opacity: 1,
          transform: 'translateX(0)',
      })),
    ])
  ]),
]);

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.css'],
  animations: [
    messageAnimation,
    avatarAnimation
  ]
})
export class ChatViewComponent implements OnInit {
  /**
   * Messages array to show
   */
  @Input() messages: Message[] = [];
  @Input() lastMessage: Message;
  @Input() context: any;

  avatarImage = null;

  constructor(
    private companyService: CompanyService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.companyService.getAsync()
      .subscribe(
        company => {
          this.avatarImage = company.avatarImage;
        },
        error => {
          this.alertService.error(error);
        }
      );
  }
}
