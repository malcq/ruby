import { of } from 'rxjs/observable/of';

export const geolocationServiceMock = jasmine.createSpyObj('GeolocationService', ['getCountry', 'getByIp', 'getByTime']);
geolocationServiceMock.getCountry.and.returnValue(of('DE'));
geolocationServiceMock.getByIp.and.returnValue(of('DE'));
geolocationServiceMock.getByTime.and.returnValue(of(['DE']));
