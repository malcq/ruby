import { of } from 'rxjs/observable/of';

export const localStorageServiceServiceMock = jasmine.createSpyObj('LocalStorageService', ['setItem', 'getItem', 'removeItem', 'getObject']);

localStorageServiceServiceMock.setItem = (name: string, value: string): Observable<void> => {
  localStorage.setItem(name, value);
  return of();
};

localStorageServiceServiceMock.getItem = (name: string): Observable<string> => {
  return of(localStorage.getItem(name));
};

localStorageServiceServiceMock.removeItem = (name: string): Observable<void> => {
  localStorage.removeItem(name);
  return of();
};

localStorageServiceServiceMock.getObject = (name: string, defaultValue: any = null): Observable<any> => {
  return this.getItem(name)
    .map((value: string) => {
      if (value === null || value === 'undefined') {
        return defaultValue;
      }

      let result = value;
      try {
        result = JSON.parse(value);
      } catch (err) {}

      return result;
    });
};
