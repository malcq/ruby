import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';

import { Feedback } from '../_models/index';
import { CurrentFeedbackService } from './current-feedback.service';
import { AuthenticationService } from './authentication.service';
import { UserService } from './user.service';
import { FileFactory } from './file-factory';

import {
  userServiceMock,
  fileFactoryMock,
  testFeedback,
  authenticationServiceMock,
} from '../../testing/index.spec';

import { WindowRef } from '../_core/window-ref';

describe('CurrentFeedbackService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CurrentFeedbackService,
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: FileFactory, useValue: fileFactoryMock },
        WindowRef,
      ]
    });
  });

  it('should be created', inject([CurrentFeedbackService], (service: CurrentFeedbackService) => {
    expect(service).toBeTruthy();
  }));

  it('should get current feedback', inject([CurrentFeedbackService], (service: CurrentFeedbackService) => {
    service.feedback = testFeedback;

    service.get()
      .subscribe((feedback: Feedback) => {
        expect(feedback.title).toEqual(testFeedback.title);
      });
  }));

  it('should save current feedback', inject([CurrentFeedbackService], (service: CurrentFeedbackService) => {
    service.remove();
    service.get()
      .subscribe((feedback: Feedback) => {
        expect(feedback.title).toEqual(null);
        const testTitle = 'test feedback title';
        feedback.title = testTitle;
        service.save();
        service.get()
          .subscribe((feedback2: Feedback) => {
            expect(feedback2.title).toEqual(testTitle);
          });
      });
  }));

  it('should remove current feedback', inject([CurrentFeedbackService], (service: CurrentFeedbackService) => {
    service.remove();
    service.get()
      .subscribe((feedback: Feedback) => {
        expect(feedback.title).toEqual(null);
        const testTitle = 'test feedback title';
        feedback.title = testTitle;
        service.save();
        service.get()
          .subscribe((feedback2: Feedback) => {
            expect(feedback2.title).toEqual(testTitle);
            service.remove();
            service.get()
              .subscribe((feedback3: Feedback) => {
                expect(feedback3.title).toEqual(null);
              });
          });
      });
  }));
});
