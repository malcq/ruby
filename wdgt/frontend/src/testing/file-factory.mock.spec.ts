import { of } from 'rxjs/observable/of';

export const fileFactoryMock = jasmine.createSpyObj('FileFactory', ['getFromJson', 'getBlobFile']);
fileFactoryMock.getFromJson.and.returnValue(of(null));
fileFactoryMock.getBlobFile.and.returnValue(of(null));
