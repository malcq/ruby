import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatViewComponent } from './chat-view.component';
import {
  AlertService,
  CurrentFeedbackService,
} from '../../../_services';

import {
  alertServiceMock,
  currentFeedbackServiceMock,
} from '../../../../testing/index.spec';

import {
  defaultModules,
} from '../../../../testing/default-modules.spec';

describe('ChatViewComponent', () => {
  let component: ChatViewComponent;
  let fixture: ComponentFixture<ChatViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [
        ChatViewComponent,
      ],
      providers: [
        { provide: AlertService, useValue: alertServiceMock },
        { provide: CurrentFeedbackService, useValue: currentFeedbackServiceMock },
      ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
