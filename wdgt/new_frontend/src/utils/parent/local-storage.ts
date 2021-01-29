import { getConnector, WindowMessage } from './connector';

export const localStorageMethod = {
  setItem: 'localStorageSetItem',
  getItem: 'localStorageGetItem',
  removeItem: 'localStorageRemoveItem',
};

export const localStorageEvent = {
};

class LocalStorage {
  setItem(name: string, value: any): Promise<void> {
    if(value === undefined) {
      value = null;
    }
    localStorage.setItem(name, value);
    return Promise.resolve();
  }

  getItem(name: string): Promise<any> {
    return Promise.resolve(localStorage.getItem(name));
  }

  removeItem(name: string): Promise<void> {
    localStorage.removeItem(name);
    return Promise.resolve();
  }
}

let localStorageInstance: LocalStorage;

export function initLocalStorage(): LocalStorage {
  if(!localStorageInstance) {
    localStorageInstance = new LocalStorage();
    const connector = getConnector();
    connector.addParentListener(localStorageMethod.setItem, {onMessage: (message: WindowMessage) => localStorageInstance.setItem(message.info.name, message.info.value).then(() => ({}))});
    connector.addParentListener(localStorageMethod.getItem, {onMessage: (message: WindowMessage) => localStorageInstance.getItem(message.info.name).then(info => ({info}))});
    connector.addParentListener(localStorageMethod.removeItem, {onMessage: (message: WindowMessage) => localStorageInstance.removeItem(message.info.name).then(() => ({}))});
    console.log('localStorage started');
  }
  return localStorageInstance;
}
