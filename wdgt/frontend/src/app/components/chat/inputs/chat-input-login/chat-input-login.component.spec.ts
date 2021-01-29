import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInputLoginComponent } from './chat-input-login.component';

import {
  AlertService,
  UserService,
} from '../../../../_services';

import {
  alertServiceMock,
  userServiceMock,
} from '../../../../../testing/index.spec';

import {
  defaultModules,
} from '../../../../../testing/default-modules.spec';

describe('ChatInputLoginComponent', () => {
  let component: ChatInputLoginComponent;
  let fixture: ComponentFixture<ChatInputLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ ChatInputLoginComponent ],
      providers: [
        { provide: AlertService, useValue: alertServiceMock },
        { provide: UserService, useValue: userServiceMock },
      ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatInputLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
