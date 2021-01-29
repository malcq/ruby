
import {filter, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpEvent, HttpResponse, HttpEventType } from '@angular/common/http';

import { Observable ,  Subject ,  of } from 'rxjs';


import { URLS } from '../config/api';

import { UploadedFile, BlobFile } from '../_models';

import { FileStorageService } from './file-storage.service';
import { DomUtilsService } from './dom-utils.service';

@Injectable()
export class FileService {
  constructor(
    private http: HttpClient,
    private fileStorageService: FileStorageService,
    private domService: DomUtilsService,
  ) { }

  upload(fileForUpload: BlobFile, sessionId: string): Observable<UploadedFile|number> {
    const formdata: FormData = new FormData();
    const subject = new Subject<UploadedFile|number>();
    let o;

    formdata.append('file', fileForUpload.blob);
    formdata.append('session_id', sessionId);

    console.debug('Start upload file', Date.now());

    const req = new HttpRequest<FormData>('POST', URLS.file, formdata, {
      reportProgress: true,
      responseType: 'json'
    });

    const onlineChangedSubscription = this.domService.onOnlineStateChange()
      .subscribe(online => {
        if (!online) {
          o.unsubscribe();
          const err = new Error('Disconnect at uploading');
          subject.error(err);
          subject.complete();
        }
      });

    o = this.http.request(req)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          subject.next(percentDone);
        } else if (event instanceof HttpResponse) {
          console.debug('Finish upload file', Date.now());
          const file = event.body['file'];
          const fileRes = this.prepareFile(file);
          fileRes.isNew = true;
          subject.next(fileRes);
          subject.complete();
          this.fileStorageService.delete(fileForUpload.dbId);
          onlineChangedSubscription.unsubscribe();
        }
      }, err => {
        console.log(err);
        subject.error(err);
        subject.complete();
        onlineChangedSubscription.unsubscribe();
      });
    return subject.asObservable();
  }

  get(id: number): Observable<UploadedFile> {
    return this.http.get<any>(`${URLS.file}/${id}`).pipe(
      map(answer => {
        const file = answer['file'];
        return this.prepareFile(file);
      }));
  }

  getByData(data: any): Observable<UploadedFile> {
    return of(this.prepareFile(data));
  }

  prepareFile(serverFile: any): UploadedFile {
    const fileRes: UploadedFile = new UploadedFile(serverFile);
    if (!fileRes.thumb) {
      fileRes.thumb = fileRes.path;
    }
    fileRes.path = `${URLS.file}/${fileRes.path}`;
    fileRes.thumb = `${URLS.file}/${fileRes.thumb}`;
    return fileRes;
  }

  getBlob(file: UploadedFile): Observable<Blob> {
    const req = new HttpRequest('GET', file.path, {
      responseType: 'blob'
    });
    let blobRes;
    return this.http.request(req).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          blobRes = event.body;
          return blobRes;
        }
      }),
      filter((answer: any) => !!answer),
      map(res => {
        return blobRes;
      }),);
  }
}
