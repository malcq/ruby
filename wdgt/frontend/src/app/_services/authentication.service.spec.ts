import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { AuthenticationService } from './authentication.service';
import { CurrentFeedbackService } from './current-feedback.service';
import { FeedbackService } from './feedback.service';
import { UserService } from './user.service';

import { currentFeedbackServiceMock, feedbackServiceMock, userServiceMock } from '../../testing/index.spec';

const hostUrl = environment.serverUrl.replace(/^https?:\/\//, '');
export function tokenGetter() {
  return true;
}

describe('AuthenticationService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    const mockJwtHelperService = jasmine.createSpyObj('JwtHelperService', ['isTokenExpired']);
    mockJwtHelperService.isTokenExpired.and.returnValue(true);

    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: JwtHelperService, useValue: mockJwtHelperService },
        { provide: CurrentFeedbackService, useValue: currentFeedbackServiceMock },
        { provide: FeedbackService, useValue: feedbackServiceMock },
        { provide: UserService, useValue: userServiceMock }
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));

  it('should try to signup', inject([AuthenticationService], (service: AuthenticationService) => {
    signup(service, () => {});
  }));

  it('should work logout and loggedIn', inject([AuthenticationService], (service: AuthenticationService) => {
    service.logout();
    expect(service.loggedIn()).toEqual(false);
    signup(service, () => {
      expect(service.loggedIn()).toEqual(true);
      service.logout();
      expect(service.loggedIn()).toEqual(false);
    });
  }));

  function signup(service, onSigned) {
    const testData = {error: false, token: 'uniq_token'};
    service.signup('John Smith', 'testEmail@mail.com')
    .subscribe(
      data => {
        expect(data).toEqual(true);
        onSigned();
      },
      error => {
        fail(`Error "${error.message}" throwed`);
      });

      const req = httpTestingController.expectOne(`${environment.serverUrl}/auth/sign_in`);
      expect(req.request.method).toEqual('POST');
      req.flush(testData);
  }

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });
});
