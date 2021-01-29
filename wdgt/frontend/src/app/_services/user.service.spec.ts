import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { UserService } from './user.service';

describe('UserService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it('should get current user', inject([UserService], (service: UserService) => {
    const testData = {
      error: false,
      user: {
        id: 6,
        email: 'restricted@email.com',
        role: 'user_restricted',
        company: { name: 'Porsche', logo: null },
        vins: [],
        username: 'John Smith',
        can_subscribe: false,
        name: 'John Smith',
        prename: null,
        country: null,
        avatar: null,
        jobs: []
      }
    };

    service.getCurrent()
      .subscribe(
        data => {
          expect(data.name).toEqual(testData.user.name);
        }
      );

    const req = httpTestingController.expectOne(`${environment.serverUrl}/users/me`);
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
  }));

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });
});
