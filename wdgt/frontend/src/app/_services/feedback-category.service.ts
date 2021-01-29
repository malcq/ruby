import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable ,  of ,  forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { URLS } from '../config/api';

import { CurrentFeedbackService } from './current-feedback.service';
import { CompanyService } from './company.service';

import { FeedbackCategory, Company } from '../_models/index';
import { feedbackCategoriesAnswer } from '../../testing/feedback-categories.sample';

import * as utils from '../_core/utils';

@Injectable()
export class FeedbackCategoryService {
  private static validTypes = ['improvement', 'issue', 'unknown'];

  private static definedByTitleTypes = {
    '3Back': {
      'Sales': 'sales',
      'Product': 'product',
      'Support': 'support',
      'Feedback': 'feedback',
    },
    'BMW': {
      'Improvement': 'improvement',
      'Issue': 'issue',
      'Retail': 'improvement',
      'Product': 'issue',
    }
  };

  private allCategories: any;

  constructor(
    private http: HttpClient,
    private currentFeedbackService: CurrentFeedbackService,
    private companyService: CompanyService,
  ) {}

  getAll(): Observable<FeedbackCategory[]> {
    return forkJoin([
        this.getAnswerPromise(),
        this.currentFeedbackService.get(),
        this.companyService.getAsync(),
      ]).pipe(
      map(([answer, feedback, company]) => {
        const catList = answer['feedbackCategories'];
        const companyId = company.id;
        const companyName = company.name;

        return catList
          .filter((cat: any) => cat.companyId === companyId)
          .map(function(category: any) {
            let type = category.type || 'unknown';

            if (!FeedbackCategoryService.validTypes.includes(category.type)) {
              type = 'unknown';
            }

            if (
              type === 'unknown' &&
              utils.get(FeedbackCategoryService, `definedByTitleTypes.${companyName}.${category.title}`)
            ) {
              type = FeedbackCategoryService.definedByTitleTypes[companyName][category.title];
            }

            return {
              id: category.id,
              company: company,
              title: category.title,
              type
            };
          });
      }));
  }

  get(id: number): Observable<FeedbackCategory> {
    return this.getAnswerPromise().pipe(
      map(answer => {
        const catList = answer['feedbackCategories'];
        return catList
          .filter((cat: any) => cat.id === id)
          .mergeMap((category: any) => {
            return this.prepareFeedbackCategory(category);
          });
      }),
      map(categories => {
        return categories[0];
      }),);
  }

  private getAnswerPromise(): Observable<any> {
    let answerPromise: any;

    if (this.allCategories) {
      answerPromise = of(this.allCategories);
    } else {
      answerPromise =  (environment.useHardcodedValues ? of(feedbackCategoriesAnswer) : this.http.get<any>(URLS.feedbackCategories)).pipe(
        map(answer => {
          this.allCategories = answer;
          return answer;
        }));
    }
    return answerPromise;
  }


  getByData(data: any): Observable<FeedbackCategory> {
    return this.prepareFeedbackCategory(data);
  }

  private prepareFeedbackCategory(data: any): Observable<FeedbackCategory> {
    return this.companyService
      .getAsync()
      .pipe(
        map((company: Company) => {
          return {
            id: data.id,
            company,
            title: data.title,
            type: data.type
          };
        })
      );
  }
}
