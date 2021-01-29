import { of } from 'rxjs/observable/of';

import { Company } from '../app/_models/index';

const mockCompanyService = jasmine.createSpyObj('CompanyService', ['get', 'getByName']);
const testCompany: Company = { id: 1, name: 'Porsche', logo: null };
mockCompanyService.get.and.returnValue(of(testCompany));
mockCompanyService.getByName.and.returnValue(of(testCompany));

export {
  mockCompanyService,
  testCompany,
};
