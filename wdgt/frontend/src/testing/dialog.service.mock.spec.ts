import { of } from 'rxjs/observable/of';

export const dialogServiceMock = jasmine.createSpyObj('DialogService', ['open', 'onOpen']);
dialogServiceMock.open.and.returnValue({
  afterClosed: () => {},
  close: () => {}
});
dialogServiceMock.onOpen.and.returnValue(of({}));
