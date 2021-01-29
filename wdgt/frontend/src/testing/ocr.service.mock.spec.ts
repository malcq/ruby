import { of } from 'rxjs/observable/of';

export const ocrServiceMock = jasmine.createSpyObj('OcrService', ['recogniseVin']);
ocrServiceMock.recogniseVin.and.returnValue(of('WBAFA71010LN00663'));
