import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
  ComponentFactoryResolver,
} from '@angular/core';

import {
  trigger,
  transition,
  animate,
  style,
  keyframes,
} from '@angular/animations';

import { ChatInputBaseComponent } from '../../chat-view/chat-input-base.component';
import { HostDirective } from '../../../../_directives/host.directive';

import { getFullBotMessageTime } from '../../../../config/chat';

import { environment } from '../../../../../environments/environment';

import {
  Message,
  MessageAction,
  MessageComponentInfo,
} from '../../../../_models/message';

const inputAnimation = trigger('inputAnimation', [
  transition(':leave', [
    animate('0.1s ease-in', style({
      // transform: 'translateY(150%)',
      // position: 'fixed',
      opacity: 0,
    })),
  ]),

  transition(':enter', [
    style({
      opacity: 0,
      // transform: 'translateY(150%)'
    }),
    animate('0.4s ease-in', keyframes([
      style({opacity: 1, offset: 0}),
      // style({opacity: 1, transform: 'translateY(-10px)', offset: 0.8}),
      // style({opacity: 1, transform: 'translateY(0)',  offset: 1.0})
    ]))
  ])
]);

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css'],
  animations: [
    inputAnimation,
  ],
})
export class ChatInputComponent implements OnInit {
  currentMessage: Message;
  hide = true;
  showTimer: any = false;

  /**
   * Last chat message to choose input to show
  */
  @Input()
  set message(value: Message) {
    this.currentMessage = value;
    this.initInput();
  }

  @Input() context: any;

  @ViewChild(HostDirective) chatHost: HostDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.initInput();
  }

  initInput() {
    this.hide = true;
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = false;
    }

    /**
     * Set timeout for imitating bot typing on frontend
     * TODO: remove when api will be capable to typing
     */
    if (this.currentMessage) {
      const chatItem = this.currentMessage.getInputComponent();
      if (chatItem) {
        this.showTimer = setTimeout(() => {
          this.hide = false;
          this.showTimer = false;
          this.changeDetector.detectChanges();

          const viewContainerRef = this.chatHost.viewContainerRef;
          viewContainerRef.clear();

          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(chatItem.component);
          const componentRef = viewContainerRef.createComponent(componentFactory);
          (<ChatInputBaseComponent>componentRef.instance).data = chatItem.data;
          (<ChatInputBaseComponent>componentRef.instance).context = this.context;

        }, chatItem.data.fakeBotTypingAnimation ? getFullBotMessageTime() : 0);
      }
    }
  }
}
