import { of } from 'rxjs/observable/of';

import { User } from '../app/_models/index';
import { testCompany } from './company.service.mock.spec';

const userServiceMock = jasmine.createSpyObj('UserService', ['getCurrent']);
const testUser: User = {
  id: 1,
  company: {...testCompany},
  name: 'test user',
  email: 'test@mail.com',
  vins: []
};
userServiceMock.getCurrent.and.returnValue(of(testUser));

export {
  testUser,
  userServiceMock
};
