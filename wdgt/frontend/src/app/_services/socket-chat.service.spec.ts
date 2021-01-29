import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { SocketChatService } from './socket-chat.service';
import { MessageFactory } from './message-factory';

import { messageFactoryMock } from '../../testing/index.spec';

describe('SocketChatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SocketChatService,
        { provide: MessageFactory, useValue: messageFactoryMock },
      ],
      imports: [
        HttpClientTestingModule,
      ]
    });
  });

  it('should be created', inject([SocketChatService], (service: SocketChatService) => {
    expect(service).toBeTruthy();
  }));
});
