import { BaseFile } from '../models/file/BaseFile';

import CancelableWithPromise from '../utils/cancelable-with-promise';
import { domService } from './dom';

function fibonacci(num: number): number {
  if (num <= 1) { return 1; }

  return fibonacci(num - 1) + fibonacci(num - 2);
}

function allProgress(onProgress: (currentLoadedPercent: number) => void, state: { loaded: boolean }): ((progress: number) => void) {
  let processingStarted: boolean = false;

  function showProcessingProgress(step: number = 0): void {
    if (state.loaded) return;
    if (step <= 5) {
      onProgress(Math.round(80 + step * 4));
      setTimeout(() => {
        showProcessingProgress(step + 1);
      }, (fibonacci(step + 1)) * 500);
    } else {
      onProgress(99);
    }
  }

  return (progress: number) => {
    if (!processingStarted) {
      let loadingProgress = progress * 0.8;
      if (loadingProgress >= 80) {
        loadingProgress = 80;
        processingStarted = true;
        showProcessingProgress();
      }
      onProgress(Math.round(loadingProgress));
    }
  }
}

export const uploadAll = (files: BaseFile[], onProgress: (uploadInfo: number[]) => void): CancelableWithPromise<void> => {
  let cancelMethod: (() => void);

  const uploadFiles = async (position: number): Promise<void> => {
    console.debug('uploadFiles position', position);
    if(position >= files.length) {
      if(files.length) {
        try {
          await domService.preloadImage(files[files.length-1].thumbSrc);
        } catch (err) {}
      }
      return; 
    }

    const file: BaseFile = files[position];
    const state: { loaded: boolean } = { loaded: false };
    const uploadedFile: BaseFile = await new Promise((resolve, reject) => {
      const upload = file.upload(allProgress((currentLoadedPercent: number): void => {
        const uploadInfo: number[] = files.map(fileForInfo => {
          let percent = 0;
          if(fileForInfo.getSize() === 0) {
            percent = 100;
          }
          if(fileForInfo.id === file.id) {
            percent = currentLoadedPercent;
          }
          return percent;
        });
        console.debug(uploadInfo);
        onProgress(uploadInfo);
      }, state));
      cancelMethod = () => {
        if(upload.cancel) {
          upload.cancel();
        }
      };
      upload.promise.then(resolve, reject);
    });
    state.loaded = true;

    let currentPosition = files.indexOf(file);
    console.debug('uploadFiles currentPosition', currentPosition);
    file.cleanFileData();
    
    files[currentPosition] = uploadedFile;

    return await uploadFiles(currentPosition+1);
  };

  const result: CancelableWithPromise<void> = {
    promise: new Promise<void>(resolve => resolve(uploadFiles(0))),
    cancel: () => {
      cancelMethod();
    }
  }
  return result;
};

