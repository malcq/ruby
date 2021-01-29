import {
  localStorageMethod,
  initLocalStorage,
} from '../utils/parent/local-storage';

import { parentService } from './parent';

class LocalStorageService {

  constructor(
  ) {
    initLocalStorage();
  }

  setItem(name: string, value: any): Promise<void> {
    return parentService.send(localStorageMethod.setItem, {info: {name, value}})
      .then(() => {});
  }

  getItem(name: string): Promise<string> {
    return parentService.send(localStorageMethod.getItem, {info: {name}})
      .then(message => message.info);
  }

  removeItem(name: string): Promise<void> {
    return parentService.send(localStorageMethod.removeItem, {info: {name}})
      .then(() => {});
  }

  getObject(name: string, defaultValue: any = null): Promise<any> {
    return this.getItem(name)
      .then((value: string) => {
        if (value === null || value === 'undefined' || value === undefined) {
          return defaultValue;
        }

        let result = value;
        try {
          result = JSON.parse(value);
        } catch (err) {}

        return result;
      });
  }
}

export const localStorageService = new LocalStorageService();