import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import {switchMap, map} from 'rxjs/operators';

import * as socketIo from 'socket.io-client';

import { environment } from '../../environments/environment';
import { URLS } from '../config/api';

import { AuthenticationService } from './authentication.service';
import { MessageFactory } from './message-factory';
import { Message, Feedback, ChatEvent } from '../_models';

@Injectable()
export class SocketChatService {
  private socket;
  private fakeMessageEmitter = new EventEmitter();
  private prevSender: string;
  private sessionId: string;
  private queue: Message[] = [];

  constructor(
    protected http: HttpClient,
    private messageFactory: MessageFactory,
    private authenticationService: AuthenticationService,
  ) {}

  connect(feedback: Feedback): Observable<Message[]> {
    this.sessionId = feedback.sessionId;
    return this.authenticationService.getToken()
      .pipe(
        switchMap(authToken => {
          this.socket = socketIo(environment.serverUrl, {
            query: {
              token: authToken,
              session_id: this.sessionId,
            }
          });

          this.onEvent(ChatEvent.CONNECT)
            .subscribe(() => {
              this.sendQueueToServer();
            });

          if (environment.chatHistory) {
            return this.http.get<any>(`${URLS.chatbot}?session_id=${this.sessionId}`).pipe(
              map(answer => {
                const messages = answer['messages'];
                if (!messages.length) {
                  const initialMessage = this.messageFactory.getInitMessage(feedback);
                  this.send(initialMessage);
                }
                return messages
                  .map((data: any) => {
                    if (environment.chatDebugMode) {
                      console.debug('history', data);
                    }
                    data.newMessage = false;
                    return this.getMessageByData(data);
                  });
              }));
          } else {
            const initialMessage = this.messageFactory.getInitMessage(feedback);
            this.send(initialMessage);
            return of([]);
          }
      }));
  }

  disconnect(): void {
    this.socket.close();
  }

  send(message: Message): void {
    if (!message || !message.canSend()) { return; }
    if (environment.chatDebugMode) {
      console.debug('send', Date.now(), message.getServerMessage());
    }

    this.queue.push(message);
    this.sendQueueToServer();
  }

  private sendQueueToServer(): void {
    if (this.queue.length && this.socket.connected) {
      const message = this.queue.shift();
      const messageForServer = message.getServerMessage();
      messageForServer.session_id = this.sessionId;
      // mocked flow graph name
      // TODO: do something with it in next iterations
      messageForServer.graph_name = 'BMW_text';

      if (environment.chatDebugMode) {
        console.debug('send to server', Date.now(), messageForServer);
      }

      // Tricky encode to avoid socket.io bug.
      // Check encodeMessage() commentary
      const encodedMessage = this.encodeMessage(messageForServer);
      this.socket.emit('chat message', encodedMessage);
      setTimeout(() => {
        this.sendQueueToServer();
      }, 0);
    }
  }

  onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      const processData = (data: any) => {
        if (environment.chatDebugMode) {
          console.debug('receive', Date.now(), data);
        }
        if (!(data instanceof Array)) {
          data = [data];
        }
        data.forEach(dataMessage => {
          dataMessage.newMessage = true;
          if (dataMessage.type === 'waiting') {
            this.send(this.messageFactory.getWaitingMessage());
          }
          observer.next(this.getMessageByData(dataMessage));
        });
      };
      this.fakeMessageEmitter.subscribe(processData);
      this.socket.on('chat message', processData);
    });
  }

  private getMessageByData(data) {
    if (this.prevSender !== data.sender) {
      this.prevSender = data.sender;
      data.firstInSecuence = true;
    }
    return this.messageFactory.getByData(data);
  }

  fakeMessage(data: any) {
    this.fakeMessageEmitter.emit(data);
  }

  onEvent(event: ChatEvent): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }

  restart(): Observable<any> {
    return this.http.post<any>(`${URLS.chatRestart}`, {session_id: this.sessionId}).pipe(
      map(answer => {
        console.debug(answer);
        return false;
      }));
  }

  encodeMessage(message) {
    /**
     * Socket.IO can disconnect on certain unicode characters (e.g. `é`)
     * This could be related to https://github.com/socketio/socket.io/issues/451
     *
     * To avoid this bug, we should encode message on front and decode on server
     * Incoming messages are ok
     */
    return encodeURI(JSON.stringify(message));
  }
}
