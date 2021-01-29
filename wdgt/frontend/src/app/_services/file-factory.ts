import { Injectable } from '@angular/core';
import { Observable ,  from ,  of } from 'rxjs';

import {
  BaseFile,
  BlobFile,
  UploadedFile,
} from '../_models';

import { FileStorageService } from './file-storage.service';

@Injectable()
export class FileFactory {

  constructor(
    private fileStorageService: FileStorageService,
  ) {}

  getFromJson(data: any): Observable<BaseFile> {
    switch (data.jsonType) {
       case 'blob':
        return from(
          this.fileStorageService.load(data.dbId)
            .then(blob => new BlobFile(blob, data.dbId))
        );
       case 'uploaded':
        return of(new UploadedFile(data));
       default:
    }
  }

  getBlobFile(file: File): Promise<BaseFile> {
    return this.fileStorageService.save(file)
      .then(dbId => new BlobFile(file, dbId));
  }
}
