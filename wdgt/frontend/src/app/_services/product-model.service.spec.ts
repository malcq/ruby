import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { AnswerInterceptor } from '../../testing/answer.interceptor';
import { environment } from '../../environments/environment';

import { ProductModelService } from './product-model.service';

describe('ProductModelService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductModelService,
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

  it('should be created', inject([ProductModelService], (service: ProductModelService) => {
    expect(service).toBeTruthy();
  }));

  it('should get product version', inject([ProductModelService], (service: ProductModelService) => {
    const testData = {
      error: false,
      product_model: {
        id: 1,
        title: 'Porsche 911 Carrera S Coupe',
        product: {
          title: 'Porsche 911',
          company: {
            id: 1,
            name: 'Porsche',
            logo: null
          },
          product_category: {
            id: 1,
            title: 'Porsche Cars'
          }
        }
      }
    };

    service.get(1)
      .subscribe(
        data => {
          expect(data.title).toEqual(testData.product_model.title);
        }
      );

    const req = httpTestingController.expectOne(`${environment.serverUrl}/product-models/1`);
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
  }));

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });
});
