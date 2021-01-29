import { of } from 'rxjs/observable/of';

export const domUtilsServiceMock = jasmine.createSpyObj(
  'DomUtilsService', [
    'scrollIntoView',
    'stopScrolling',
    'onResize',
    'getSize',
    'preload',
    'preloadImagesForOffline',
    'onOnlineStateChange',
    'isOnline'
  ]
);
domUtilsServiceMock.getSize.and.returnValue({width: 640, height: 480});
domUtilsServiceMock.onResize.and.returnValue(of({width: 640, height: 480}));
domUtilsServiceMock.onOnlineStateChange.and.returnValue(of(true));
domUtilsServiceMock.isOnline.and.returnValue(true);
