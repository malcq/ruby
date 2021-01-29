import { Injectable, NgZone } from '@angular/core';

import { of } from 'rxjs/observable/of';

import { Feedback } from '../app/_models';

import { environment } from '../environments/environment';

import { testUser } from './user.service.mock.spec';
import { testFeedback } from './feedback.service.mock.spec';


const currentFeedbackServiceMock = jasmine.createSpyObj('CurrentFeedbackService', [
  'remove', 'get', 'save', 'isNeedReRecordFile', 'getLastVinInfo', 'setProductModel'
]);
currentFeedbackServiceMock.get.and.callFake( () => of({...testFeedback}) );
currentFeedbackServiceMock.setProductModel.and.callFake( () => of({...testFeedback}) );
currentFeedbackServiceMock.getLastVinInfo.and.returnValue(  {vin: null, modalName: null} );
currentFeedbackServiceMock.isNeedReRecordFile.and.callFake( () => of(false) );
currentFeedbackServiceMock.feedbackChanges$ = of(null);

const emptyCurrentFeedbackServiceMock = jasmine.createSpyObj('CurrentFeedbackService', [
  'remove', 'get', 'save', 'isNeedReRecordFile', 'getLastVinInfo', 'setProductModel'
]);
const emptyCurrentFeedback = {
  id: 1,
  tagDone: false,
  tags: []
};
emptyCurrentFeedbackServiceMock.get.and.callFake( () => of({...emptyCurrentFeedback}) );
emptyCurrentFeedbackServiceMock.isNeedReRecordFile.and.callFake( () => of(false) );

export {
  currentFeedbackServiceMock,
  emptyCurrentFeedbackServiceMock
};
