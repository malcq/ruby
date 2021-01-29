import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Feedback, Company, Note } from '../app/_models';

import { testCompany } from './company.service.mock.spec';
import { testProductModel } from './product-model.service.mock.spec';
import { testFeedbackCategory } from './feedback-category.service.mock.spec';
import { testUser } from './user.service.mock.spec';

const feedbackServiceMock = jasmine.createSpyObj('FeedbackService', [
  'create',
  'get',
  'getAll',
  'getStarredFeedbacks',
  'getAllFeedbackNotes',
  'getFeedbackNotes'
]);

const feedback: Feedback = {
    id: 1,
    company: testCompany,
    productModel: testProductModel,
    feedbackCategory: testFeedbackCategory,
    title: 'testTitle',
    description: 'description',
    user: testUser,
    files: [],
    vin: 'WBAFA71010LN00663',
    country: 'DE',
    chatCategory: null,
    isEditable: true,
};

const notEditedNote = {
  id: 1,
  text: 'Test note',
  feedbackId: 1,
  editing: false,
  author: {
    email: 'admin@3back.com',
    id: 1,
    name: 'admin name',
  }
};


const editedNote = {
  id: 1,
  text: 'Test note',
  feedbackId: 1,
  editing: true,
  author: {
    email: 'admin@3back.com',
    id: 1,
    name: 'admin name',
  }
};

feedbackServiceMock.create.and.callFake( () => of({...feedback}) );
feedbackServiceMock.get.and.callFake( () => of({...feedback}) );
feedbackServiceMock.getAll.and.callFake( () => {
  return of(feedbackServiceMock.needEmpty ? [] : [{...feedback}]);
});
feedbackServiceMock.getStarredFeedbacks.and.callFake( () => {
  return of(feedbackServiceMock.needEmpty ? [] : [{...feedback}]);
});
feedbackServiceMock.getAllFeedbackNotes.and.callFake( () => of(feedbackServiceMock.needNote ? [{...notEditedNote}] : []) );
feedbackServiceMock.getFeedbackNotes.and.callFake( () => of(feedbackServiceMock.needEditedNote ? [{...editedNote}] : []) );

feedbackServiceMock.clean = () => {
  feedbackServiceMock.needEmpty = false;
  feedbackServiceMock.needNote = false;
  feedbackServiceMock.needEditedNote = false;
};

feedbackServiceMock.needEmpty = false;
feedbackServiceMock.needNote = false;
feedbackServiceMock.needEditedNote = false;

const testFeedback: Feedback = {
    id: 1,
    company: testCompany,
    productModel: testProductModel,
    feedbackCategory: testFeedbackCategory,
    title: 'testTitle',
    description: 'description',
    user: testUser,
    files: [],
    vin: 'WBAFA71010LN00663',
    country: 'DE',
    chatCategory: null,
    isEditable: true,
};

const testNote = {
  id: 1,
  text: 'Test note',
  feedbackId: 1,
  editing: false,
  author: {
    email: 'admin@3back.com',
    id: 1,
    name: 'admin name',
  }
};


class MockFeedbackService {
  needEmpty = false;
  needNote = false;
  needEditedNote = false;

  public create(): Observable<Feedback> {
    return of({...testFeedback});
  }

  public get(): Observable<Feedback> {
    return of({...testFeedback});
  }

  public getAll(): Observable<Feedback[]> {
    return of(this.needEmpty ? [] : [{...testFeedback}]);
  }

  public getStarredFeedbacks(): Observable<Feedback[]> {
    return of(this.needEmpty ? [] : [{...testFeedback}]);
  }

  public getAllFeedbackNotes(): Observable<Note[]> {
    const notes = [];
    if (this.needNote) {
      const note = {...testNote};
      if (this.needEditedNote) {
        note.editing = true;
      }
      notes.push(note);
    }
    return of(notes);
  }

  public getFeedbackNotes(): Observable<Note[]> {
    const notes = [];
    if (this.needNote) {
      const note = {...testNote};
      if (this.needEditedNote) {
        note.editing = true;
      }
      notes.push(note);
    }
    return of(notes);
  }
}

export {
  feedbackServiceMock,
  MockFeedbackService,
  testFeedback,
};
