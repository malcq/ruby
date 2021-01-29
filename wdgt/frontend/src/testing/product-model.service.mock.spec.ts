import { of } from 'rxjs/observable/of';

import { ProductModel } from '../app/_models';

export const testProductModel: ProductModel = {
  id: 1,
  productId: 1,
  title: 'test',
  image: null
};
export const productModelServiceMock = jasmine.createSpyObj('ProductModelService', ['getByVin']);
productModelServiceMock.getByVin.and.returnValue( of(testProductModel) );
