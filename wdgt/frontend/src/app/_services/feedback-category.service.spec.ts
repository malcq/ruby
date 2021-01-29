import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { AnswerInterceptor } from '../../testing/answer.interceptor';
import { URLS } from '../config/api';

import { FeedbackCategoryService } from './feedback-category.service';

const testCompany = {
  id: 1,
  name: 'Porsche',
  logo: null
};
const feedbackCategoriesTestAnswer = {
  error: false,
  feedback_categories: [
    {
      id: 1,
      title: 'Improvement',
      type: 'improvement',
      company_id: 1,
      created_at: '2018-06-04T09:54:38.721Z',
      updated_at: '2018-06-04T09:54:38.721Z',
      created_by: 1
    },
    {
      id: 2,
      title: 'Issue',
      type: 'issue',
      company_id: 1,
      created_at: '2018-06-04T09:54:38.721Z',
      updated_at: '2018-06-04T09:54:38.721Z',
      created_by: 1
    }
  ]
};

describe('FeedbackCategoryService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeedbackCategoryService,
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

  it('should be created', inject([FeedbackCategoryService], (service: FeedbackCategoryService) => {
    expect(service).toBeTruthy();
  }));

  it('should get feedback-categories', inject([FeedbackCategoryService], (service: FeedbackCategoryService) => {
    service.getAll()
      .subscribe(
        feedbackCategories => {
          expect(feedbackCategories[0].title).toEqual(feedbackCategoriesTestAnswer.feedback_categories[0].title);
        }
      );

    const req = httpTestingController.expectOne(URLS.feedbackCategories);
    expect(req.request.method).toEqual('GET');
    req.flush(feedbackCategoriesTestAnswer);
  }));

  it('should get one feedback-category', inject([FeedbackCategoryService], (service: FeedbackCategoryService) => {
    service.get(1)
      .subscribe(
        feedbackCategory => {
          expect(feedbackCategory.title).toEqual(feedbackCategoriesTestAnswer.feedback_categories[0].title);
        }
      );

    const req = httpTestingController.expectOne(URLS.feedbackCategories);
    expect(req.request.method).toEqual('GET');
    req.flush(feedbackCategoriesTestAnswer);
  }));

  it('non existing categories should have type "unknown"', inject([FeedbackCategoryService], (service: FeedbackCategoryService) => {
    const testData = {
      error: false,
      feedback_categories: [
        {
          id: 1,
          title: 'Unknown',
          company_id: 1,
          created_at: '2018-06-04T09:54:38.721Z',
          updated_at: '2018-06-04T09:54:38.721Z',
          created_by: 1
        }
      ]
    };
    service.getAll()
      .subscribe(
        feedbackCategories => {
          expect(feedbackCategories[0].type).toEqual('unknown');
        }
      );

    const req = httpTestingController.expectOne(URLS.feedbackCategories);
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
  }));

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });
});
