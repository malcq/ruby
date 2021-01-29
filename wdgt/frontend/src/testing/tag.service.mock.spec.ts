import { of } from 'rxjs/observable/of';

const tagServiceMock = jasmine.createSpyObj('TagService', ['findTagsByWordPart']);

tagServiceMock.findTagsByWordPart.and.returnValue( of([]) );

export {
  tagServiceMock
};
