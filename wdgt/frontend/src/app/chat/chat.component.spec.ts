import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { environment } from '../../environments/environment';

import { ChatComponent } from './chat.component';
import { User } from '../_models';
import {
  AlertService,
  SocketChatService,
  UserService,
  CurrentFeedbackService,
  AuthenticationService,
  MessageFactory,
  DomUtilsService,
} from '../_services';

import {
  currentFeedbackServiceMock,
  alertServiceMock,
  userServiceMock,
  messageFactoryMock,
  authenticationServiceMock,
  domUtilsServiceMock,
  DummyComponent,
} from '../../testing/index.spec';

import {
  defaultModules,
} from '../../testing/default-modules.spec';


describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async(() => {
    const mockSocketChatService = jasmine.createSpyObj('SocketChatService', ['connect', 'onMessage', 'onEvent', 'disconnect']);
    mockSocketChatService.connect.and.returnValue( of([]) );
    mockSocketChatService.onMessage.and.returnValue( new Observable() );
    mockSocketChatService.onEvent.and.returnValue( new Observable() );

    TestBed.configureTestingModule(defaultModules({
      declarations: [
        ChatComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'a', component: ChatComponent},
          {path: 'summary', component: DummyComponent},
        ]),
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: SocketChatService, useValue: mockSocketChatService },
        { provide: AlertService, useValue: alertServiceMock },
        { provide: CurrentFeedbackService, useValue: currentFeedbackServiceMock },
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        { provide: DomUtilsService, useValue: domUtilsServiceMock },
        { provide: MessageFactory, useValue: messageFactoryMock },
      ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.whenStable().then(() => {
      expect(component).toBeTruthy();
    });
  });

  it('should be done', async(inject([Router, Location], (router: Router, location: Location) => {
    component.emitChatDone();
    fixture.whenStable().then(() => {
      expect(location.path()).toEqual('/summary');
    });
  })));
});
