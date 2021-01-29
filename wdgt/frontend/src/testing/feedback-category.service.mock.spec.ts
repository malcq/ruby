import { of } from 'rxjs/observable/of';

import { FeedbackCategory } from '../app/_models';

import { testCompany } from './company.service.mock.spec';

export const testFeedbackCategory: FeedbackCategory = {
  id: 1,
  company: testCompany,
  title: 'test category',
  type: 'test'
};
export const feedbackCategoryServiceMock = jasmine.createSpyObj('FeedbackCategoryService', ['getAll']);
feedbackCategoryServiceMock.getAll.and.returnValue( of([]) );

