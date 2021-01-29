import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/observable/of';

import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { ROUTES } from '../config/router';

import { FeedbackComponent } from './feedback.component';

import {
  defaultModules,
} from '../../testing/default-modules.spec';

import { User } from '../_models';

import {
  AlertService,
  UserService,
  CurrentFeedbackService,
  FeedbackService,
  AuthenticationService,
} from '../_services';

import {
  alertServiceMock,
  userServiceMock,
  currentFeedbackServiceMock,
  authenticationServiceMock,
  DummyComponent,
  testFeedback,
} from '../../testing/index.spec';

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;

  const feedbackServiceMock = jasmine.createSpyObj('FeedbackService', ['create']);
  feedbackServiceMock.create.and.returnValue( of(true) );

  beforeEach(async(() => {

    TestBed.configureTestingModule(defaultModules({
      declarations: [ FeedbackComponent ],
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'a', component: FeedbackComponent},
          {path: 'final', component: DummyComponent},
          {path: 'file-list', component: DummyComponent},
          {path: 'chat', component: DummyComponent}
        ]),
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
        { provide: CurrentFeedbackService, useValue: currentFeedbackServiceMock },
        { provide: FeedbackService, useValue: feedbackServiceMock },
        { provide: AuthenticationService, useValue: authenticationServiceMock }
      ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    component.feedback = testFeedback;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send feedback', async(inject([Router, Location], (router: Router, location: Location) => {
    fixture.ngZone.run(() => {
      component.sendFeedback();
      fixture.whenStable().then(() => {
        expect(feedbackServiceMock.create).toHaveBeenCalled();
        expect(location.path()).toEqual('/final');
      });
    });
  })));

  it('should change file', async(inject([Router, Location], (router: Router, location: Location) => {
    fixture.ngZone.run(() => {
      spyOn(router, 'navigate');
      component.onFileClick();
      fixture.whenStable().then(() => {
        expect(router.navigate).toHaveBeenCalledWith([`/${ROUTES.fileList}`], { queryParams: { back: `/${ROUTES.summary}` }});
      });
    });
  })));

  it('should goto chat', async(inject([Router, Location], (router: Router, location: Location) => {
    fixture.ngZone.run(() => {
      spyOn(router, 'navigate');
      component.gotoChat();
      fixture.whenStable().then(() => {
        expect(router.navigate).toHaveBeenCalledWith([`/${ROUTES.chat}`], { queryParams: { back: `/${ROUTES.summary}` }});
      });
    });
  })));
});
