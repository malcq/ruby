import { getConnector, WindowMessage } from './connector';

export const partSize = 5 * 1024 * 1024;

export const fileStorageMethod = {
  clearAll: 'fileStorageClearAll',

  getFilePart: 'fileStorageGetFilePart',
  delFilePart: 'fileStorageDelFilePart',
  putFilePart: 'fileStoragePutFilePart',

  getFileInfo: 'fileStorageGetFileInfo',
  delFileInfo: 'fileStorageDelFileInfo',
  putFileInfo: 'fileStoragePutFileInfo',
};

export const fileStorageEvent = {
};

const win = window as any;

class FileStorage {
  private indexedDB = win['indexedDB'] || win['mozIndexedDB'] || win['webkitIndexedDB'] || win['msIndexedDB'];
  private IDBTransaction = win['IDBTransaction'] || win['webkitIDBTransaction'] || win['msIDBTransaction'];

  private baseName = 'filesBase';
  private storeName = 'filePartStore';
  private storeInfoName = 'fileInfoStore';

  connectDB(): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = this.indexedDB.open(this.baseName, 1);
      request.onerror = (err: Error) => {
        reject(err);
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onupgradeneeded = (event: any) => {
        event.currentTarget.result.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement : true });
        event.currentTarget.result.createObjectStore(this.storeInfoName, { keyPath: 'id', autoIncrement : true });
        resolve(this.connectDB());
      };
    });
  }

  clearAll(): Promise<void> {
    return this.connectDB()
      .then(db => {
        const requestPart = db.transaction([this.storeName], 'readwrite').objectStore(this.storeName).clear();
        const requestInfo = db.transaction([this.storeInfoName], 'readwrite').objectStore(this.storeInfoName).clear();
        requestPart.onerror = (err: Error) => {
          console.log(err);
        };
        requestPart.onsuccess = () => {
          console.debug(this.storeName + ' cleared');
        };
        requestInfo.onerror = (err: Error) => {
          console.log(err);
        };
        requestInfo.onsuccess = () => {
          console.debug(this.storeInfoName + ' cleared');
        };
      });
  }

  getFilePart(id: string): Promise<ArrayBuffer | null> {
    return this.connectDB()
      .then(db => {
        return new Promise<ArrayBuffer | null>((resolve, reject) => {
          const request = db.transaction([this.storeName], 'readonly').objectStore(this.storeName).get(Number(id));
          request.onerror = reject;
          request.onsuccess = () => {
            resolve(request.result ? (request.result.part as ArrayBuffer) : null);
          };
        });
      });
  }

  delFilePart(id: string): Promise<void> {
    return this.connectDB()
      .then(db => {
        return new Promise<void>((resolve, reject) => {
          const request = db.transaction([this.storeName], 'readwrite').objectStore(this.storeName).delete(Number(id));
          request.onerror = reject;
          request.onsuccess = () => {
            console.debug('File deleted from DB:', id);
            resolve();
          };
        });
      });
  }

  putFilePart(part: ArrayBuffer): Promise<string> {
    return this.connectDB()
      .then(db => {
        return new Promise<string>((resolve, reject) => {
          const request = db.transaction([this.storeName], 'readwrite').objectStore(this.storeName).put({part});
          request.onerror = reject;
          request.onsuccess = () => {
            resolve(request.result ? request.result : null);
          };
        });
      });
  }

  getFileInfo(id: string): Promise<any> {
    return this.connectDB()
      .then(db => {
        return new Promise<any>((resolve, reject) => {
          const request = db.transaction([this.storeInfoName], 'readonly').objectStore(this.storeInfoName).get(Number(id));
          request.onerror = reject;
          request.onsuccess = () => {
            resolve(request.result ? request.result.info : null);
          };
        });
      });
  }

  delFileInfo(id: string): Promise<void> {
    return this.connectDB()
      .then(db => {
        return new Promise<void>((resolve, reject) => {
          const request = db.transaction([this.storeInfoName], 'readwrite').objectStore(this.storeInfoName).delete(Number(id));
          request.onerror = reject;
          request.onsuccess = () => {
            console.debug('Info delete from DB:', id);
            resolve();
          };
        });
      });
  }

  putFileInfo(info: any): Promise<string> {
    return this.connectDB()
      .then(db => {
        return new Promise<string>((resolve, reject) => {
          const request = db.transaction([this.storeInfoName], 'readwrite').objectStore(this.storeInfoName).put({info});
          request.onerror = reject;
          request.onsuccess = () => {
            resolve(request.result ? request.result : null);
          };
        });
      });
  }
}

let fileStorageInstance: FileStorage;

export function initFileStorage(): FileStorage {
  if(!fileStorageInstance) {
    fileStorageInstance = new FileStorage();
    const connector = getConnector();
    connector.addParentListener(fileStorageMethod.clearAll, {onMessage: (message: WindowMessage) => fileStorageInstance.clearAll().then(data => ({}))});
  
    connector.addParentListener(fileStorageMethod.getFilePart, {onMessage: (message: WindowMessage) => fileStorageInstance.getFilePart(message.info).then(data => ({data}))});
    connector.addParentListener(fileStorageMethod.delFilePart, {onMessage: (message: WindowMessage) => fileStorageInstance.delFilePart(message.info).then(() => ({}))});
    connector.addParentListener(fileStorageMethod.putFilePart, {onMessage: (message: WindowMessage) => fileStorageInstance.putFilePart(message.data as ArrayBuffer).then(info => ({info}))});
  
    connector.addParentListener(fileStorageMethod.getFileInfo, {onMessage: (message: WindowMessage) => fileStorageInstance.getFileInfo(message.info).then(info => ({info}))});
    connector.addParentListener(fileStorageMethod.delFileInfo, {onMessage: (message: WindowMessage) => fileStorageInstance.delFileInfo(message.info).then(() => ({}))});
    connector.addParentListener(fileStorageMethod.putFileInfo, {onMessage: (message: WindowMessage) => fileStorageInstance.putFileInfo(message.info).then(info => ({info}))});
  
    console.log('file storage started');
  }
  return fileStorageInstance;
}
