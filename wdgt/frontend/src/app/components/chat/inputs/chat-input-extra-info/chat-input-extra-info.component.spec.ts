import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInputExtraInfoComponent } from './chat-input-extra-info.component';

import {
  AuthenticationService,
  CurrentFeedbackService,
  AlertService,
} from '../../../../_services';

import {
  authenticationServiceMock,
  currentFeedbackServiceMock,
  alertServiceMock,
} from '../../../../../testing/index.spec';

import {
  defaultModules,
} from '../../../../../testing/default-modules.spec';

describe('ChatInputExtraInfoComponent', () => {
  let component: ChatInputExtraInfoComponent;
  let fixture: ComponentFixture<ChatInputExtraInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ ChatInputExtraInfoComponent ],
      providers: [
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        { provide: CurrentFeedbackService, useValue: currentFeedbackServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
      ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatInputExtraInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
