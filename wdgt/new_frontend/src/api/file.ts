import axios from './axios';

import config from '../config';

import { BaseFile } from '../models/file/BaseFile';
import { getUploadedFile } from '../models/file/factories';
import { ISession } from '../models/user';

import CancelableWithPromise from '../utils/cancelable-with-promise';
import a from 'axios'
const CancelToken = a.CancelToken;

export class FileService {
  private sessionId: string | null = null;

  uploadBlob(blob: File, onProgress: (currentLoadedPercent: number) => void): CancelableWithPromise<BaseFile> {
    if(this.sessionId === null) {
      return {
        promise: Promise.reject(new Error('File API not initalised by sessionId')),
        cancel: () => {}
      };
    }

    const formData: FormData = new FormData();

    formData.append('file', blob);
    formData.append('session_id', this.sessionId);

    console.debug('Start upload file', Date.now());

    let offlineListener: () => void;
    let cancelMethod: (() => void);
    const answer: CancelableWithPromise<BaseFile> = {
      promise: new Promise<BaseFile>((resolve, reject) => {
        offlineListener = () => {
          reject(new Error('Disconnect at uploading'));
        }
        window.addEventListener('offline', offlineListener);
        const config = {
          onUploadProgress: (progressEvent: any) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          },
          cancelToken: new CancelToken((cancel: () => void) => {
            cancelMethod = cancel;
          })
        };
        console.debug('config ready', Date.now());
        resolve(
          axios.post('/files', formData, config)
            .then(async ( answer: any ) => {
              console.debug('Finish upload file', Date.now());
              const { data } = answer;
              window.removeEventListener('offline', offlineListener);
              const fileData: any = data.file;
              const file = await this.prepareFile(fileData);
              file.isNew = true;
              return file;
            })
            .catch(err => {
              console.debug('Error upload file', Date.now());
              window.removeEventListener('offline', offlineListener);
              throw(err);
            })
        );
      }),
      cancel: () => {
        cancelMethod();
      }
    };
    return answer;
  }

  init({ sessionId }: ISession) {
    this.sessionId = sessionId;
  }

  async get(id: number): Promise<BaseFile> {
    const { data } = await axios.get(`/files/info/${id}`);
    const fileData: any = data.file;
    return this.prepareFile(fileData);
  }

  prepareFile(fileData: any): Promise<BaseFile> {
    if (!fileData.thumb) {
      fileData.thumb = fileData.path;
    }
    fileData.path = `${config.apiUrlApp}/files/${fileData.path}`;
    fileData.thumb = `${config.apiUrlApp}/files/${fileData.thumb}`;
    return getUploadedFile(fileData);
  }
}


export const fileService = new FileService();