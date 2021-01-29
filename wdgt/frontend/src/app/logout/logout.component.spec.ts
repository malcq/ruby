import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { LogoutComponent } from './logout.component';

import {
  defaultModules,
} from '../../testing/default-modules.spec';

import {
  AuthenticationService,
  CurrentFeedbackService,
} from '../_services';

import {
  authenticationServiceMock,
  currentFeedbackServiceMock,
} from '../../testing/index.spec';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(defaultModules({
      declarations: [ LogoutComponent ],
      imports: [
        RouterTestingModule.withRoutes([{path: '', component: LogoutComponent}])
      ],
      providers: [
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        { provide: CurrentFeedbackService, useValue: currentFeedbackServiceMock },
      ]
    }))
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('init test', async(inject([Router, Location], (router: Router, location: Location) => {
    expect(location.path()).toEqual('');
    fixture.whenStable().then(() => {
      expect(authenticationServiceMock.logout).toHaveBeenCalled();
      expect(location.path()).toEqual('/');
    });
  })));
});
