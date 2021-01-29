import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/observable/of';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { FinalMessageComponent } from './final-message.component';

import {
  defaultModules,
} from '../../testing/default-modules.spec';

import {
  AlertService,
  AuthenticationService,
  CurrentFeedbackService,
  UserService
} from '../_services';

import {
  alertServiceMock,
  userServiceMock,
  authenticationServiceMock,
  currentFeedbackServiceMock,
  DummyComponent
} from '../../testing/index.spec';

describe('FinalMessageComponent', () => {
  let component: FinalMessageComponent;
  let fixture: ComponentFixture<FinalMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ FinalMessageComponent ],
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'a', component: FinalMessageComponent},
          {path: 'camera', component: DummyComponent}
        ]),
      ],
      providers: [
        { provide: AlertService, useValue: alertServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        { provide: CurrentFeedbackService, useValue: currentFeedbackServiceMock },
      ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
