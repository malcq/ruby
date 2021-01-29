import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AnswerInterceptor } from '../../testing/answer.interceptor';
import { environment } from '../../environments/environment';

import { FileService } from './file.service';
import { FileStorageService } from './file-storage.service';
import { BlobFile, UploadedFile } from '../_models';

import { WindowRef } from '../_core/window-ref';
import { windowRefMock } from '../../testing/index.spec';


describe('FileService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    const fileStorageServiceMock = jasmine.createSpyObj('FileStorageService', ['delete']);
    fileStorageServiceMock.delete.and.returnValue(null);
    TestBed.configureTestingModule({
      providers: [
        FileService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AnswerInterceptor,
          multi: true,
        },
        { provide: FileStorageService, useValue: fileStorageServiceMock },
        { provide: WindowRef, useValue: windowRefMock },
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([FileService], (service: FileService) => {
    expect(service).toBeTruthy();
  }));

  it('should process file upload', inject([FileService], (service: FileService) => {
    const testData = {
      'error': false,
      'file': {
        'is_edited': false,
        'is_categorisation_finished': false,
        'categorisation_result': {},
        'id': 601,
        'link': '2770c956d32403222dfbb7ea273dd36e',
        'path': '2770c956d32403222dfbb7ea273dd36e_vin_bw.jpg',
        'user_id': 160,
        'type': 'image',
        'session_id': 1364,
        'name': 'vin_bw.jpg',
        'thumb': null,
        'created_by': 160,
        'updated_at': '2019-01-28T05:51:29.434Z',
        'created_at': '2019-01-28T05:51:29.434Z',
        'duration': null,
        'feedback_id': null,
        'processed': true,
        'transcript': null,
        'translation': null,
        'original_file_id': null
      }
    };

    service.upload(new BlobFile(new File([new Blob([])], ''), ''), 'test_session_id')
      .subscribe(
        answer => {
          if (answer instanceof UploadedFile) {
            console.log(answer);
            /*expect(answer).toEqual({
              'name': 'SampleVideo_1280x720_30mb.mp4',
              'path': environment.serverUrl + '/files/979d3c138047c3b3a39a520d2e8bd3f3_SampleVideo_1280x720_30mb.mp4',
              'thumb': environment.serverUrl + '/files/thumbnail_979d3c138047c3b3a39a520d2e8bd3f3.png',
              duration: 233,
              'type': 'video'
            });*/
          }
        }
      );

    const req = httpTestingController.expectOne(`${environment.serverUrl}/files`);
    expect(req.request.method).toEqual('POST');
    req.flush(testData);
  }));

  it('should get file info', inject([FileService], (service: FileService) => {
    const testData = {
      'error': false,
      'file': {
        'link': '979d3c138047c3b3a39a520d2e8bd3f3',
        'name': 'SampleVideo_1280x720_30mb.mp4',
        'path': '979d3c138047c3b3a39a520d2e8bd3f3_SampleVideo_1280x720_30mb.mp4',
        'thumb': 'thumbnail_979d3c138047c3b3a39a520d2e8bd3f3.png',
        duration: 233,
        'type': 'video',
        'feedbackId': null,
        'userId': 1,
        'createdBy': 2
      }
    };

    service.get(1)
      .subscribe(
        answer => {
          console.log(answer);
          /*expect(answer).toEqual({
            'name': 'SampleVideo_1280x720_30mb.mp4',
            'path': environment.serverUrl + '/files/979d3c138047c3b3a39a520d2e8bd3f3_SampleVideo_1280x720_30mb.mp4',
            'thumb': environment.serverUrl + '/files/thumbnail_979d3c138047c3b3a39a520d2e8bd3f3.png',
            duration: 233,
            'type': 'video'
          });*/
        }
      );

    const req = httpTestingController.expectOne(`${environment.serverUrl}/files/1`);
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
  }));

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });
});
