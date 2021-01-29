
import {map, switchMap, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Observable ,  of ,  forkJoin ,  Subject } from 'rxjs';

import { Feedback, BaseFile, UploadedFile, ProductModel } from '../_models';

import { UserService } from './user.service';
import { FileStorageService } from './file-storage.service';
import { AuthenticationService } from './authentication.service';
import { LocalStorageService } from './local-storage.service';
import { FileFactory } from './file-factory';
import { CompanyService } from './company.service';

import { environment } from '../../environments/environment';

@Injectable()
export class CurrentFeedbackService {
  public feedback: Feedback;
  private feedbackChangesSource = new Subject<any>();
  feedbackChanges$ = this.feedbackChangesSource.asObservable();

  constructor(
    private userService: UserService,
    private fileStorageService: FileStorageService,
    private authenticationService: AuthenticationService,
    private localStorageService: LocalStorageService,
    private fileFactory: FileFactory,
    private companyService: CompanyService,
  ) { }

  get(): Observable<Feedback> {
    if (!this.feedback) {
      return this.authenticationService.loggedIn().pipe(
        switchMap(loggedIn => {
          if (!loggedIn) {
            return of(null);
          } else {
            const allFiles = this.localStorageService.getItem('feedback_files').pipe(
              switchMap(feedback_files => {
                const filesOb = JSON.parse(feedback_files || '[]')
                  .map(data => this.fileFactory.getFromJson(data))
                  .filter(file => file);
                return filesOb.length ? forkJoin(filesOb) : of([]);
              }));

            return forkJoin([
              this.userService.getCurrent(),
              allFiles,
              this.companyService.getAsync(),
              this.localStorageService.getObject('feedback_id', 0),
              this.localStorageService.getObject('feedback_company'),
              this.localStorageService.getObject('feedback_productModel'),
              this.localStorageService.getObject('feedback_feedbackCategory'),
              this.localStorageService.getObject('feedback_chatDone', false),
              this.localStorageService.getObject('feedback_chatCategory'),
              this.localStorageService.getObject('feedback_isEditable', true),
              this.localStorageService.getItem('feedback_title'),
              this.localStorageService.getItem('feedback_description'),
              this.localStorageService.getObject('feedback_vin'),
              this.localStorageService.getObject('feedback_vin_id', null),
              this.localStorageService.getObject('feedback_sessionId'),
              this.localStorageService.getObject('feedback_updateRequest', false),
              this.localStorageService.getObject('feedback_country'),
            ]).pipe(
            map(([
              user,
              files,
              company,
              feedback_id,
              feedback_company,
              feedback_productModel,
              feedback_feedbackCategory,
              feedback_chatDone,
              feedback_chatCategory,
              feedback_isEditable,
              feedback_title,
              feedback_description,
              feedback_vin,
              feedback_vin_id,
              feedback_sessionId,
              feedback_updateRequest,
              feedback_country
            ]) => {
              this.feedback = {
                id: feedback_id,
                companyId: company.id,
                productModel: feedback_productModel,
                feedbackCategory: feedback_feedbackCategory,
                chatDone: feedback_chatDone,
                chatCategory: feedback_chatCategory,
                files: <BaseFile[]>files,
                isEditable: feedback_isEditable,
                title: feedback_title,
                description: feedback_description,
                vin: feedback_vin,
                vinId: feedback_vin_id,
                sessionId: feedback_sessionId,
                user,
                updateRequest: feedback_updateRequest,
                country: feedback_country,
              };
              console.debug(this.feedback);

              return this.feedback;
            }));
          }
        }));
    } else {
      return of(this.feedback);
    }
  }

  save(): Observable<Feedback> {
    return forkJoin([
      this.localStorageService.setItem('feedback_id', this.feedback.id + ''),
      this.localStorageService.setItem('feedback_company', JSON.stringify(this.feedback.companyId)),
      this.localStorageService.setItem('feedback_productModel', JSON.stringify(this.feedback.productModel)),
      this.localStorageService.setItem('feedback_feedbackCategory', JSON.stringify(this.feedback.feedbackCategory)),
      this.localStorageService.setItem('feedback_chatDone', JSON.stringify(this.feedback.chatDone)),
      this.localStorageService.setItem('feedback_chatCategory', JSON.stringify(this.feedback.chatCategory)),
      this.localStorageService.setItem('feedback_files', JSON.stringify(this.feedback.files)),
      this.localStorageService.setItem('feedback_isEditable', JSON.stringify(this.feedback.isEditable)),
      this.localStorageService.setItem('feedback_title', this.feedback.title),
      this.localStorageService.setItem('feedback_description', this.feedback.description),
      this.localStorageService.setItem('feedback_vin', this.feedback.vin),
      this.localStorageService.setItem('feedback_vin_id', this.feedback.vinId + ''),
      this.localStorageService.setItem('feedback_sessionId', this.feedback.sessionId),
      this.localStorageService.setItem('feedback_updateRequest', JSON.stringify(this.feedback.updateRequest)),
      this.localStorageService.setItem('feedback_country', JSON.stringify(this.feedback.country))
    ]).pipe(
      map(() => {
        this.feedbackChangesSource.next(null);
        return this.feedback;
      }));
  }

  remove(): Observable<void> {
    this.feedback = null;
    return forkJoin([
      this.localStorageService.removeItem('feedback_id'),
      this.localStorageService.removeItem('feedback_company'),
      this.localStorageService.removeItem('feedback_productModel'),
      this.localStorageService.removeItem('feedback_feedbackCategory'),
      this.localStorageService.removeItem('feedback_chatDone'),
      this.localStorageService.removeItem('feedback_chatCategory'),
      this.localStorageService.removeItem('feedback_title'),
      this.localStorageService.removeItem('feedback_description'),
      this.localStorageService.removeItem('feedback_files'),
      this.localStorageService.removeItem('feedback_isEditable'),
      this.localStorageService.removeItem('feedback_vin'),
      this.localStorageService.removeItem('feedback_vin_id'),
      this.localStorageService.removeItem('feedback_sessionId'),
      this.localStorageService.removeItem('feedback_updateRequest'),
      this.localStorageService.removeItem('feedback_country'),
      this.localStorageService.removeItem('last_url'),
      this.fileStorageService.clearAll(),
      this.authenticationService.logout(),
    ]).pipe(
      map(() => {
        this.feedbackChangesSource.next(null);
      }));
  }

  setProductModel(productModel: ProductModel, vin: string, vinId: number, sessionId: string, country: string): Observable<Feedback>  {
    const obs: Observable<any>[] = [this.get()];
    if (vin) {
      obs.push(this.localStorageService.setItem('last_vin', vin));
      obs.push(this.localStorageService.setItem('last_model_name', productModel.title));
    }

    return forkJoin(obs).pipe(
      switchMap(([feedback]) => {
        if (vin) {
          feedback.vin = vin;
          feedback.vinId = vinId;
        }
        feedback.productModel = productModel;
        feedback.sessionId = sessionId;
        feedback.country = country;
        return this.save();
      }));
  }

  getLastVinInfo(): Observable<any>  {
    return forkJoin([
      this.localStorageService.getItem('last_vin'),
      this.localStorageService.getItem('last_model_name')
    ]).pipe(
      map(([vin, modalName]) => ({vin, modalName})));
  }

  setLastUrl(url: string): Observable<void> {
    return this.localStorageService.setItem('last_url', url);
  }

  getLastUrl(): Observable<string> {
    return this.localStorageService.getItem('last_url');
  }

  isNeedReRecordFile(): Observable<boolean> {
    return this.get().pipe(
      map(feedback => {
        let result = feedback.updateRequest;
        if (result) {
          (feedback.files || []).forEach(file => {
            if (!file.needSendToServer && (<UploadedFile>file).isNew) {
              result = false;
            }
          });
        }
        return result;
      }));
  }

  clearAllFiles(): Observable<void> {
    return this.get().pipe(
      switchMap(feedback => {
        return this.fileStorageService.clearAll().pipe(
          switchMap(() => {
            feedback.files = [];
            return this.save().pipe(map(() => {}));
          }));
      }));
  }

  addFiles(files: BaseFile[]): Observable<void> {
    return this.get().pipe(
      switchMap(feedback => {
        feedback.files = feedback.files.concat(files);
        return this.save().pipe(map(() => {}));
      }));
  }

  removeFeedbackSessionId(): Observable<void> {
    return this.localStorageService.removeItem('feedback_sessionId');
  }

  setFeedbackSessionId(id: string): Observable<Feedback> {
    return this.get().pipe(
      mergeMap((feedback: Feedback) => {
        feedback.sessionId = id;
        return this.save();
      })
    )
  }
}

