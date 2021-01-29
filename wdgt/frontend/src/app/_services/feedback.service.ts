import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable ,  forkJoin ,  of } from 'rxjs';
import {switchMap, map, mergeMap } from 'rxjs/operators';

import { URLS } from '../config/api';

import { Feedback, User, Note, UploadedFile, Company } from '../_models';
import { UserService } from './user.service';
import { ProductModelService } from './product-model.service';
import { FeedbackCategoryService } from './feedback-category.service';
import { FileService } from './file.service';
import { GeolocationService } from './geolocation.service';
import { CompanyService } from './company.service';
import { CurrentFeedbackService } from './current-feedback.service';

@Injectable()
export class FeedbackService {
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private productModelService: ProductModelService,
    private feedbackCategoryService: FeedbackCategoryService,
    private fileService: FileService,
    private geolocationService: GeolocationService,
    private companyService: CompanyService,
    private currentFeedbackService: CurrentFeedbackService,
  ) {}

  create(feedback: Feedback): Observable<boolean> {
    const feedbackInfo: any = {
      company_id: feedback.companyId,
      user_id: feedback.user.id,
      feedback_category_id: feedback.feedbackCategory.id,
      product_id: feedback.productModel.productId,
      product_model_id: feedback.productModel.id,
      vin_id: feedback.vinId,
      description: feedback.description,
      feedback_source_id: 2,
      session_id: feedback.sessionId
    };

    if (feedback.chatCategory) {
      feedbackInfo.title = feedback.chatCategory.title;
      if (feedback.chatCategory.categories) {
        feedbackInfo.categories = feedback.chatCategory.categories;
      }
    }

    if (feedback.files.length) {
      feedbackInfo.files = [];
      feedback.files.forEach(file => {
        if (file.needSendToServer) {
          throw new Error('Some file not uploaded');
        } else {
          feedbackInfo.files.push((<UploadedFile>file).serverId);
        }
      });
    }
    let sendDataOb;
    if (feedback.id) {
      sendDataOb = this.http.put<any>(`${URLS.feedback}/${feedback.id}`, feedbackInfo);
    } else {
      sendDataOb = this.http.post<any>(URLS.feedback, feedbackInfo);
    }
    return sendDataOb
      .pipe(
        map((answer: any) => {
          return true;
        })
      )
  }

  get(id: number): Observable<Feedback> {
    return this.http.get<any>(`${URLS.feedback}/${id}`).pipe(
      switchMap(answer => {
        console.debug(answer);
        return this.getDyData(answer['feedback']);
      }));
  }

  getDyData(feedback: any): Observable<Feedback> {
    return forkJoin([
      this.userService.getCurrent(),
      this.companyService.getAsync(),
      this.prepareFeedbackData(feedback)
    ]).pipe(
    map((data: any[]) => {
      console.debug(data);
      return this.feedbackFromData(data);
    }));
  }

  prepareFeedbackData(feedback: any): Observable<any> {
    const allFilesObs = [];
    if (!feedback.files) {
      feedback.files = [];
    }

    feedback.files.forEach((fileData: any) => {
      allFilesObs.push(this.fileService.getByData(fileData));
    });

    let productModelOb;
    if (feedback.productModel) {
      feedback.productModel.product = feedback.product;
      productModelOb = this.productModelService.getByData(feedback.productModel);
    } else {
      productModelOb = this.productModelService.get(feedback.productModelId);
    }

    const feedbackCategoryOb = feedback.feedbackCategory ?
      this.feedbackCategoryService.getByData(feedback.feedbackCategory) :
      this.feedbackCategoryService.get(feedback.feedbackCategoryId);

    const allFilesOb = allFilesObs.length ?
      forkJoin(allFilesObs) :
      of([]);

    return forkJoin([
      productModelOb,
      feedbackCategoryOb,
      allFilesOb,
      this.geolocationService.getCountry(),
    ]).pipe(
    map((data: any[]) => {
      const [productModel, feedbackCategory, files, country] = data;

      feedback.productModel = productModel;
      feedback.feedbackCategory = feedbackCategory;
      feedback.files = files;
      feedback.vin = productModel.vin.vin;
      feedback.vinId = productModel.vin.id;
      feedback.country = country;
      return feedback;
    }));
  }

  feedbackFromData(data: any[]): Feedback {
    const currentUser: User = data[0];
    const company: Company = data[1];
    const feedbackData: any = data[2];

    if (currentUser.id !== feedbackData.userId) {
      throw(new Error('Wrong user in feedback'));
    }
    const feedback: Feedback = {
      id: feedbackData.id,
      companyId: company.id,
      title: feedbackData.title,
      user: currentUser,
      productModel: feedbackData.productModel,
      feedbackCategory: feedbackData.feedbackCategory,
      description: feedbackData.description,
      chatCategory: {title: feedbackData.title, categories: null},
      chatDone: true,
      files: feedbackData.files,
      vin: feedbackData.vin,
      country: feedbackData.country,
      isEditable: true,
    };
    if (feedbackData.feedbackSession) {
      feedback.sessionId = feedbackData.feedbackSession.id;
    }

    console.debug(feedback);

    return feedback;
  }

  createCurrentFeedback() {
    return this.currentFeedbackService.get()
      .pipe(
        mergeMap((feedback) => {
          return this.create(feedback);
        })
      );
  }

  generateFeedbackSession(): Observable<any> {
    return this.http.post<any>(URLS.feedbackSession, {})
      .pipe(
        mergeMap((response) => {
          const { id } = response.feedbackSession;
          return this.currentFeedbackService.setFeedbackSessionId(`${id}`);
        })
      );
  }
}
