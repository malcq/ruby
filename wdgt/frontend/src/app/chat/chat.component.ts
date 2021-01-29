
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  HostBinding,
  ChangeDetectorRef,
  HostListener,
  ElementRef,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, of, Subscription } from 'rxjs';
import { switchMap,  skip, delay, mergeMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { WindowRef } from '../_core/window-ref';
import { ROUTES } from '../config/router';

import { ChatViewComponent } from '../components/chat/chat-view/chat-view.component';
import {
  CHAT_ANIMATION_CONFIG,
  getFullBotMessageTime,
} from '../config/chat';

import {
  ChatCategory,
  Message,
  Feedback,
  ChatEvent,
  MessageLink,
  MessageAction,
} from '../_models';

import {
  AlertService,
  SocketChatService,
  CurrentFeedbackService,
  MessageFactory,
  DomUtilsService,
  WidgetService,
  FeedbackService
} from '../_services';

import {
  actionsBotRequest,
  loginBotRequest,
  usualBotMessage,
  usualUserMessage,
  inputBotRequest,
  inputNumbersBotRequest,
  linkBotMessage,
  emailInfoRequest,
  usernameInfoRequest,
  selectBotMessage,
  searchBotMessage,
} from './chat.mocks';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  public suggestionShowed = false;
  public model: any = {};

  public messages: Message[] = [];
  public lastMessage: Message;

  @ViewChild('chatView') chatViewRef: ChatViewComponent;
  @ViewChild('scroller') scroller;

  @HostBinding('class.desktop') isDesktop = true;

  private messagesQueue: any = {
    list: [],
    waiting: false,
  };

  private subscriptions: Subscription[] = [];

  /**
   * Collection of chat init subscriptions
   * If chat will be reinited, it should be unsubscribed
   */
  private chatInitSubscriptions: Subscription[] = [];

  public debugMode = environment.chatDebugMode;
  public currentFeedback: Feedback;

  context: any = {
    iphoneScrolling: false,
    sendText: (text: string) => {
      const message = this.messageFactory.getUserTextMessage(text);
      this.chatService.send(message);
    },
    sendConfirmEmail: (text: string) => {
      const message = this.messageFactory.getEmailConfirmMessage(text);
      this.chatService.send(message);
    },
    sendAnswer: (answer: MessageAction) => {
      const message = this.messageFactory.getUserAnswerMessage(answer);
      this.chatService.send(message);
    },
    addTag: (text: string, tag: ChatCategory) => {
      this.currentFeedbackService.get()
      .subscribe(
        feedback => {
          feedback.chatCategory = tag;
          this.currentFeedbackService.save().subscribe(() => {});
        },
        error => {
          this.alertService.error(error);
        }
      );
      const message = this.messageFactory.getUserAnswerSuggestionMessage(text, tag.categories);
      this.chatService.send(message);
    },
    done: () => {
      this.emitChatDone();
    },
    makeCall: (tel: string) => {
      this.win.nativeWindow.document.location = `tel:${tel}`;
    },
    suggestionShow: (scrollElement) => {
      this.suggestionShowed = true;
      /**
       * Because Angular will apply class after function is done,
       * we should scroll in microtask after rerender
       */
      setTimeout(() => {
        this.domService.scrollIntoView(scrollElement, 0);
      }, 0);
    },
    suggestionHide: () => {
      this.suggestionShowed = false;
    },
  };


  constructor(
    private cdr: ChangeDetectorRef,
    private win: WindowRef,
    private chatService: SocketChatService,
    private alertService: AlertService,
    private currentFeedbackService: CurrentFeedbackService,
    private messageFactory: MessageFactory,
    private domService: DomUtilsService,
    private hostRef: ElementRef,
    private widgetService: WidgetService,
    private feedbackService: FeedbackService,
  ) { }

  @HostListener('touchstart') onTouchStart() {
    this.domService.stopScrolling();
  }

  ngOnInit() {
    const configSub = this.widgetService.getConfig().subscribe((config) => {
      this.context.iphoneScrolling = config.useIphoneScrolling;
      this.isDesktop = !config.useIphoneScrolling;
    });

    this.subscriptions.push(configSub);
  }

  ngAfterViewInit() {
    // Wait for user to open widget
    const sub = this.widgetService.onOpen$.subscribe((inited) => {
      if (inited) {
        this.init();
        if (sub) {
          sub.unsubscribe();
        }
      }
    });
  }

  ngOnDestroy() {
    this.chatService.disconnect();
    this.subscriptions.forEach((sub) => {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    })
    this.chatInitSubscriptions.forEach((sub) => {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    })
  }

  init() {
    if (this.chatInitSubscriptions && this.chatInitSubscriptions.length) {
      this.chatInitSubscriptions.forEach(sub => {
        sub.unsubscribe();
      });
    }

    this.currentFeedbackService.get()
      .pipe(
        mergeMap(
          (feedback: Feedback) => {
            console.log('inside get feedback', feedback)
            if (!feedback.sessionId) {
              return this.feedbackService
                .generateFeedbackSession()
                .pipe(
                  mergeMap(() => this.currentFeedbackService.get())
                );
            }
            return of(feedback);
          }
        )
      )
      .subscribe(
        (feedback: Feedback) => {
          this.currentFeedback = feedback;
          this.chatInitSubscriptions = this.initConnection();
          this.cdr.detectChanges();
        },
        error => {
          this.alertService.error(error);
        }
      );
  }

  private initConnection(): Subscription[] {
    const subscriptions: Subscription[] = [];

    const connectSub = this.chatService.connect(this.currentFeedback)
      .subscribe((messages: Message[]) => {
        let lastPos = messages.length - 1;
        while (lastPos >= 0 && !messages[lastPos].haveInput) {
          lastPos--;
        }
        if (lastPos >= 0) {
          this.lastMessage = messages[lastPos];
        } else {
          this.lastMessage = null;
        }

        this.messages = messages;
        const heightSub = this.sendChatHeight().subscribe(() => {
          setTimeout(() => {
            this.scrollToBottom(500);
            this.domService.preload('https://www.bmwusa.com/content/dam/bmwusa/Forms/form__owners-manual.jpg');
          }, 100);
        });

        const onMessageSub = this.chatService.onMessage()
          .subscribe((message: Message) => this.recieveMessage(message));

        const onConnectSub = this.chatService.onEvent(ChatEvent.CONNECT)
          .subscribe(() => {
            console.debug('connected');
          });

        const onDisconnectSub = this.chatService.onEvent(ChatEvent.DISCONNECT)
          .subscribe(() => {
            console.debug('disconnected');
          });

        subscriptions.push(heightSub);
        subscriptions.push(onMessageSub);
        subscriptions.push(onConnectSub);
        subscriptions.push(onDisconnectSub);
      });
      subscriptions.push(connectSub);
      return subscriptions;
  }

  sendMessage(message: Message) {
    this.chatService.send(message);
  }

  recieveMessage(message: Message) {
    this.messagesQueue.list.push(message);
    this.tryAddMessageFromQueue();
  }

  addMessageToList(message: Message) {
    if (message.haveInput) {
      this.lastMessage = message;
    }
    this.messages.push(message);
    this.sendChatHeight().subscribe(() => {});

    let scrollDelay = getFullBotMessageTime() - CHAT_ANIMATION_CONFIG.MESSAGE_CONTENT_FILL_TIME;
    const scrollTime = 500;

    if (!message.getItemComponent()) { return; }

    if (message instanceof MessageLink) {
      scrollDelay = getFullBotMessageTime({ withoutTyping: true });
    }

    if (message.sender === 'user') {
      return;
    }

    setTimeout(() => {
      this.scrollToBottom(scrollTime);
    }, scrollDelay);
  }

  tryAddMessageFromQueue() {
    if (this.messagesQueue.list.length && !this.messagesQueue.waiting) {
      this.messagesQueue.waiting = true;
      const message = <Message>this.messagesQueue.list.shift();
      this.addMessageToList(message);
      const delay = message.fakeBotTypingAnimation
        ? getFullBotMessageTime() + CHAT_ANIMATION_CONFIG.PAUSE_BETWEEN_MESSAGES
        : 0;
      setTimeout(() => {
        this.messagesQueue.waiting = false;
        this.tryAddMessageFromQueue();
      }, delay);
    }
  }

  back() {
    this.widgetService.close();
  }

  emitChatDone() {
    this.feedbackService.createCurrentFeedback()
      .subscribe(() => {
        this.messages = [];
        this.widgetService.close();
        this.subscribeForReinit();
        this.domService.setIframeHeight(0);
        this.currentFeedback.chatDone = true;
      });

  }

  scrollToBottom(duration = 999) {
    if (this.isDesktop) {
      return this.scrollToBottomDesktop(duration);
    }
    return this.scrollToBottomMobile(duration);
  }

  scrollToBottomDesktop(duration) {
    this.domService.scrollIntoViewByParent(
      this.hostRef.nativeElement,
      this.scroller.nativeElement,
      duration
    );
  }

  scrollToBottomMobile(duration) {
    this.domService.scrollIntoView(this.scroller.nativeElement, duration);
  }

  sendChatHeight(): Observable<void> {
    return of(null).pipe(
      delay(10)
    ).pipe(switchMap(() => this.domService.setIframeHeight(this.hostRef.nativeElement.offsetHeight)));
  }

  subscribeForReinit() {
    this.chatService.disconnect();

    const sub = this.widgetService.onOpen$
      .pipe(
        // ⚠️ First subscription will perform right away, because it's a behaviour subject subscribe.
        // We should wait for second trigger, when user actually opens the chat again
        skip(1),
        mergeMap(() => {
          return this.chatService.restart();
        })
      )
      .subscribe(() => {
        this.init();
        sub.unsubscribe();
      });
  }

  restartChat() {
    this.chatService.restart().subscribe(() => {
      this.messages = [];
      this.chatService.disconnect();
      this.init();
    });
  }

  /**
   * DEBUG FUNCTIONS
   */
  addLoginMessage() {
    this.chatService.fakeMessage(loginBotRequest());
  }

  addBotMessage() {
    this.chatService.fakeMessage(usualBotMessage());
  }

  addUserMessage() {
    this.chatService.fakeMessage(usualUserMessage());
  }

  addActionsMessage() {
    this.chatService.fakeMessage(actionsBotRequest());
  }

  addInputMessage() {
    this.chatService.fakeMessage(inputBotRequest());
  }

  addInputNumbersMessage() {
    this.chatService.fakeMessage(inputNumbersBotRequest());
  }

  addLinkMessage() {
    this.chatService.fakeMessage(linkBotMessage());
  }

  addEmailMessage() {
    this.chatService.fakeMessage(emailInfoRequest());
  }

  addUsernameMessage() {
    this.chatService.fakeMessage(usernameInfoRequest());
  }

  addSelectorMessage() {
    this.chatService.fakeMessage(selectBotMessage());
  }

  addSearchMessage() {
    this.chatService.fakeMessage(searchBotMessage());
  }

  addHistory() {
    const history: Message[] = [
      this.messageFactory.getByData({
        text: 'Hi, I am the bot',
        sender: 'bot'
      }),
      this.messageFactory.getByData({
        text: 'Hi, I am the user!',
        sender: 'user'
      })
    ];
    this.messages = this.messages.concat(history);
  }
}
