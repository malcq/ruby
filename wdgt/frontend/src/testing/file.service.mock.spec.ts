import { of } from 'rxjs/observable/of';

export const fileServiceMock = jasmine.createSpyObj('FileService', ['upload', 'get', 'getBlob']);
fileServiceMock.upload.and.returnValue(of(null));
fileServiceMock.get.and.returnValue(of(null));
fileServiceMock.getBlob.and.returnValue(of(null));
