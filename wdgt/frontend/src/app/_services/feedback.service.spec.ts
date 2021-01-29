import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/observable/of';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { AnswerInterceptor } from '../../testing/answer.interceptor';
import { URLS } from '../config/api';

import { Feedback } from '../_models/index';
import { FeedbackService } from './feedback.service';
import { UserService } from './user.service';
import { ProductModelService } from './product-model.service';
import { FeedbackCategoryService } from './feedback-category.service';
import { FileService } from './file.service';
import { GeolocationService } from './geolocation.service';
import { userServiceMock, testCompany } from '../../testing/index.spec';

describe('FeedbackService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    const productModelServiceMock = jasmine.createSpyObj('ProductModelService', ['get', 'getByData']);
    productModelServiceMock.get.and.returnValue( of({
      'id': 596,
      'title': 'X5 3.0D',
      'image': 'https://s3.eu-central-1.amazonaws.com/3back/BMW/X/F15/Xseries+X5+F15.png',
      'productId': 92,
      'vin': {
          'id': 104,
          'vin': 'WBAFA71010LN00663',
          'data': {
              'axle': 'AWD',
              'make': 'BMW',
              'type': 'executive cars / higher-medium class',
              'model': 'E53',
              'colour': 'BLACK SAPPHIRE METALLIC',
              'engine': '3.00',
              'gearbox': 'Automatic transmission',
              'bodyType': 'SUV',
              'trimLevel': 'X5 3.0D',
              'generation': 'I',
              'enginePower': '',
              'gearboxType': 'Automatic',
              'numberOfDoors': '5',
              'bodyColourSample': '',
              'interiorFabricColour': 'SCHWARZ',
              'interiorFabricDesign': 'STANDARDLEDER/SCHWARZ'
          },
          'created_at': '2018-11-19T06:57:26.274Z',
          'updated_at': '2018-11-19T06:57:26.274Z',
          'product_model_id': 596,
          'created_by': 160,
          'country_id': 56
      }
    }) );
    productModelServiceMock.getByData.and.returnValue( of({
      'id': 596,
      'title': 'X5 3.0D',
      'image': 'https://s3.eu-central-1.amazonaws.com/3back/BMW/X/F15/Xseries+X5+F15.png',
      'productId': 92,
      'vin': {
          'id': 104,
          'vin': 'WBAFA71010LN00663',
          'data': {
              'axle': 'AWD',
              'make': 'BMW',
              'type': 'executive cars / higher-medium class',
              'model': 'E53',
              'colour': 'BLACK SAPPHIRE METALLIC',
              'engine': '3.00',
              'gearbox': 'Automatic transmission',
              'bodyType': 'SUV',
              'trimLevel': 'X5 3.0D',
              'generation': 'I',
              'enginePower': '',
              'gearboxType': 'Automatic',
              'numberOfDoors': '5',
              'bodyColourSample': '',
              'interiorFabricColour': 'SCHWARZ',
              'interiorFabricDesign': 'STANDARDLEDER/SCHWARZ'
          },
          'created_at': '2018-11-19T06:57:26.274Z',
          'updated_at': '2018-11-19T06:57:26.274Z',
          'product_model_id': 596,
          'created_by': 160,
          'country_id': 56
      }
    }) );

    const feedbackCategoryServiceMock = jasmine.createSpyObj('FeedbackCategoryService', ['get', 'getByData']);
    feedbackCategoryServiceMock.get.and.returnValue( of({
      id: 1,
      company: testCompany,
      title: 'test version category',
      type: 'unknown'
    }) );
    feedbackCategoryServiceMock.getByData.and.returnValue( of({
      id: 1,
      company: testCompany,
      title: 'test version category',
      type: 'unknown'
    }) );

    const fileServiceMock = jasmine.createSpyObj('FileService', ['get']);
    fileServiceMock.get.and.returnValue( of({
      'name': 'SampleVideo_1280x720_30mb.mp4',
      'path': '979d3c138047c3b3a39a520d2e8bd3f3_SampleVideo_1280x720_30mb.mp4',
      'thumb': 'thumbnail_979d3c138047c3b3a39a520d2e8bd3f3.png',
      'type': 'video'
    }) );

    const geolocationServiceMock = jasmine.createSpyObj('GeolocationService', ['getCountry']);
    geolocationServiceMock.getCountry.and.returnValue( of('RU') );

    TestBed.configureTestingModule({
      providers: [
        FeedbackService,
        { provide: UserService, useValue: userServiceMock },
        { provide: ProductModelService, useValue: productModelServiceMock },
        { provide: FeedbackCategoryService, useValue: feedbackCategoryServiceMock },
        { provide: FileService, useValue: fileServiceMock },
        { provide: GeolocationService, useValue: geolocationServiceMock },
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

  it('should be created', inject([FeedbackService], (service: FeedbackService) => {
    expect(service).toBeTruthy();
  }));

  it('should get feedback', inject([FeedbackService], (service: FeedbackService) => {
    const testData = {
      'error': false,
      'feedback': {
          'id': 204,
          'type': null,
          'title': 'Engine Grinding',
          'description': 'null',
          'is_public': false,
          'is_confirmed': false,
          'reference_id': 'Eg8HQq',
          'chatbot_data': [{
            'car': 'x5 3.0d'}, {
            'part': 'some part'}, {
            'search': 'Engine Grinding '}, {
            'type': 'Experience'}, {
            'issue': 'Engine'}, {
            'main parts category': 'Noise'}, {
            'part group': 'Engine'}, {
            'part sub-group': 'Grinding'}, {
            'mileage': 'Dont know'}, {
            'username': 'Maxim Pashkov'}, {
            'email': 'bjaka.max@gmail.com'
          }],
          'additional_data': {},
          'categories_data': ['0__Experience|1__Noise|2__Engine|3__Grinding'],
          'created_at': '2019-01-29T15:23:18.619Z',
          'updated_at': '2019-01-29T15:23:18.619Z',
          'company_id': 1,
          'user_id': 1,
          'product_model_id': 596,
          'feedback_category_id': 1,
          'feedback_source_id': 2,
          'product_id': 92,
          'created_by': 160,
          'vin_id': 104,
          'division_id': null,
          'feedback_session': {
              'id': 1384,
              'email': 'bjaka.max@gmail.com'
          },
          'feedback_stars': [],
          'feedback_flags': [],
          'feedback_reads': [],
          'product_model': {
              'id': 596,
              'title': 'X5 3.0D',
              'year': null,
              'image': 'https://s3.eu-central-1.amazonaws.com/3back/BMW/X/F15/Xseries+X5+F15.png',
              'created_at': '2018-12-04T17:15:44.839Z',
              'updated_at': '2018-12-04T17:15:44.839Z',
              'product_id': 92,
              'company_id': null,
              'vin': {
                  'id': 104,
                  'vin': 'WBAFA71010LN00663',
                  'data': {
                      'axle': 'AWD',
                      'make': 'BMW',
                      'type': 'executive cars / higher-medium class',
                      'model': 'E53',
                      'colour': 'BLACK SAPPHIRE METALLIC',
                      'engine': '3.00',
                      'gearbox': 'Automatic transmission',
                      'bodyType': 'SUV',
                      'trimLevel': 'X5 3.0D',
                      'generation': 'I',
                      'enginePower': '',
                      'gearboxType': 'Automatic',
                      'numberOfDoors': '5',
                      'bodyColourSample': '',
                      'interiorFabricColour': 'SCHWARZ',
                      'interiorFabricDesign': 'STANDARDLEDER/SCHWARZ'
                  },
                  'created_at': '2018-11-19T06:57:26.274Z',
                  'updated_at': '2018-11-19T06:57:26.274Z',
                  'product_model_id': 596,
                  'created_by': 160,
                  'country_id': 56
              }
          },
          'product': {
              'id': 92,
              'title': 'E53',
              'company_id': 1,
              'brand_unit_id': 1,
              'created_at': '2018-12-04T17:15:44.827Z',
              'updated_at': '2018-12-04T17:15:44.827Z',
              'country_id': 52,
              'series_id': 34,
              'created_by': 1,
              'country': {
                  'id': 52,
                  'code': 'CV',
                  'name': 'Cape Verde',
                  'full_name': 'Republic of Cape Verde',
                  'iso3': 'CPV',
                  'number': '132',
                  'created_at': '2018-07-25T14:20:05.090Z',
                  'updated_at': '2018-07-25T14:20:05.090Z',
                  'continent_id': 1
              }
          },
          'vin': {
              'id': 104,
              'vin': 'WBAFA71010LN00663',
              'data': {
                  'axle': 'AWD',
                  'make': 'BMW',
                  'type': 'executive cars / higher-medium class',
                  'model': 'E53',
                  'colour': 'BLACK SAPPHIRE METALLIC',
                  'engine': '3.00',
                  'gearbox': 'Automatic transmission',
                  'bodyType': 'SUV',
                  'trimLevel': 'X5 3.0D',
                  'generation': 'I',
                  'enginePower': '',
                  'gearboxType': 'Automatic',
                  'numberOfDoors': '5',
                  'bodyColourSample': '',
                  'interiorFabricColour': 'SCHWARZ',
                  'interiorFabricDesign': 'STANDARDLEDER/SCHWARZ'
              },
              'created_at': '2018-11-19T06:57:26.274Z',
              'updated_at': '2018-11-19T06:57:26.274Z',
              'product_model_id': 596,
              'created_by': 160,
              'country_id': 56,
              'country': {
                  'id': 56,
                  'code': 'DE',
                  'name': 'Germany',
                  'full_name': 'Federal Republic of Germany',
                  'iso3': 'DEU',
                  'number': '276',
                  'created_at': '2018-07-25T14:20:05.090Z',
                  'updated_at': '2018-07-25T14:20:05.090Z',
                  'continent_id': 3
              }
          },
          'division': null,
          'files': [],
          'feedback_source': {
              'id': 2,
              'title': 'Web App',
              'created_at': '2018-07-25T14:20:28.105Z',
              'updated_at': '2018-07-25T14:20:28.105Z'
          },
          'feedback_category': {
              'id': 1,
              'title': 'Issue',
              'company_id': 1,
              'created_at': '2018-07-25T14:20:07.020Z',
              'updated_at': '2018-07-25T14:20:07.020Z',
              'created_by': 1
          }
      }
  };

    service.get(1)
      .subscribe((feedback: Feedback) => {
        expect(feedback.title).toEqual(testData.feedback.title);
      });

    const req = httpTestingController.expectOne(`${URLS.feedback}/1`);
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
  }));

  it('should create new feedback', inject([FeedbackService], (service: FeedbackService) => {
    const testData = {
      error: false,
      feedback: {
        id: 0,
        company_id: 1,
        ProductModelId: 1,
        productCategoryId: 1,
        title: 'testTitle',
        description: 'description',
        userId: 1,
        tags: [{
          id: 2,
          title: 'test tag category',
          parentId: 1
        }]
      }
    };

    service.create({
        id: 0,
        company: testCompany,
        productModel: {
          id: 1,
          productId: 1,
          title: 'test product',
          image: ''
        },
        feedbackCategory: {
          id: 1,
          company: testCompany,
          title: 'test category',
          type: 'test'
        },
        title: 'testTitle',
        description: 'description',
        user: {
          id: 1,
          company: {
            id: 1,
            name: 'Porsche',
            logo: null
          },
          name: 'test',
          email: 'test@mail.com',
          vins: []
        },
        files: [],
        chatCategory: null,
        isEditable: true,
    })
      .subscribe((answer) => {
        expect(answer).toEqual(true);
      });
    const req = httpTestingController.expectOne(URLS.feedback);
    expect(req.request.method).toEqual('POST');
    req.flush(testData);
  }));

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });
});
