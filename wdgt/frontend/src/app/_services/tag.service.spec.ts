import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { AnswerInterceptor } from '../../testing/answer.interceptor';
import { environment } from '../../environments/environment';

import { TagService } from './tag.service';

describe('TagService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
      TagService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AnswerInterceptor,
          multi: true,
        },
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([TagService], (service: TagService) => {
    expect(service).toBeTruthy();
  }));

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });
});
