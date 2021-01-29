import { of } from 'rxjs/observable/of';

export const messageFactoryMock = jasmine.createSpyObj('MessageFactory', ['getInitMessage', 'getWaitingMessage', 'getByData']);
messageFactoryMock.getInitMessage.and.returnValue(null);
messageFactoryMock.getWaitingMessage.and.returnValue(null);
messageFactoryMock.getByData.and.returnValue(null);
