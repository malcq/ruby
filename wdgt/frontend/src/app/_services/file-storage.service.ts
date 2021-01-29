import { Injectable } from '@angular/core';

import { Observable ,  from } from 'rxjs';

import {
  fileStorageMethod,
  partSize,
} from '../_parent/file-storage';

import { ParentService } from './parent.service';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {

  constructor(
    private parentService: ParentService
  ) {}

  save(file: File): Promise<string> {
    return Promise.all([this.putFileInfo({type: file.type, fileName: file.name}), this.putFile(file)])
      .then(([infoId, partsIds]) => infoId + ',' + partsIds);
  }

  load(id: string): Promise<File> {
    const idParts = id.split(',');
    const infoId = idParts.shift();
    return this.getFileInfo(infoId)
      .then(info => this.getFile(idParts, info));
  }

  delete(id: string): Promise<void[]> {
    const idParts = id.split(',');
    const infoId = idParts.shift();
    const promises = [this.delFileInfo(infoId)];
    idParts.forEach(partId => promises.push(this.delFilePart(partId)));
    return Promise.all(promises);
  }

  clearAll(): Observable<void> {
    return from(this.parentService.send(fileStorageMethod.clearAll).then(() => {}));
  }

  private getFile(idParts: string[], info: any, file: File = null): Promise<File> {
    const id = idParts.shift();
    return this.getFilePart(id)
      .then(part => {
        if (!file) {
          file = new File([new Blob([part], {type: info.type})], info.fileName, {type: info.type});
        } else {
          file = new File([file, new Blob([part], {type: info.type})], info.fileName, {type: info.type});
        }
        if (idParts.length) {
          return this.getFile(idParts, info, file);
        } else {
          return file;
        }
      });
  }

  private putFile(file: File, ids: string = null, partNum = 0): Promise<string> {
    const blob = this.sliceBlob(file, partNum * partSize, (partNum + 1) * partSize);
    return this.blobToArrayBuffer(blob)
      .then(part => this.putFilePart(part))
      .then(id => {
        if (!ids) {
          ids = id;
        } else {
          ids += ',' + id;
        }
        if (file.size > (partNum + 1) * partSize) {
          return this.putFile(file, ids, partNum + 1);
        } else {
          return ids;
        }
      });
  }

  private sliceBlob(blob, start, end) {
    if (blob.slice) {
      return blob.slice(start, end);
    } else if (blob.mozSlice) {
      return blob.mozSlice(start, end);
    } else if (blob.webkitSlice) {
      return blob.webkitSlice(start, end);
    }
  }

  private blobToArrayBuffer(blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('loadend', (e) => {
        resolve(reader.result);
      });
      reader.addEventListener('error', reject);
      reader.readAsArrayBuffer(blob);
    });
  }

  private arrayBufferToFile(buffer: ArrayBuffer, type: string, fileName: string): File {
    return new File([new Blob([buffer], {type})], fileName, {type});
  }

  private getFilePart(id: string): Promise<ArrayBuffer> {
    return this.parentService.send(fileStorageMethod.getFilePart, {info: id})
      .then(message => message.data);
  }

  private delFilePart(id: string): Promise<void> {
    return this.parentService.send(fileStorageMethod.delFilePart, {info: id}).then(() => {});
  }

  private putFilePart(part: ArrayBuffer): Promise<string> {
    return this.parentService.send(fileStorageMethod.putFilePart, {data: part})
      .then(message => message.info);
  }

  private getFileInfo(id: string): Promise<any> {
    return this.parentService.send(fileStorageMethod.getFileInfo, {info: id})
      .then(message => message.info);
  }

  private delFileInfo(id: string): Promise<void> {
    return this.parentService.send(fileStorageMethod.delFileInfo, {info: id}).then(() => {});
  }

  private putFileInfo(info: any): Promise<string> {
    return this.parentService.send(fileStorageMethod.putFileInfo, {info})
      .then(message => message.info);
  }
}
