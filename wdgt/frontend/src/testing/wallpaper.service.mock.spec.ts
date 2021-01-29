import { of } from 'rxjs/observable/of';

export const wallpaperServiceMock = jasmine.createSpyObj('WallpaperService', [
  'changeImage',
  'removeImage',
  'enableBlur',
  'disableBlur',
  'toggleBlur',
  'enableOverlay',
  'disableOverlay',
  'toggleOverlay',
  'enableBlurAndOverlay',
]);

wallpaperServiceMock.wallpaperChanges$ = of(null);
