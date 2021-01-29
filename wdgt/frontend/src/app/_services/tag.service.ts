
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,  of } from 'rxjs';

import { URLS } from '../config/api';

import { ChatCategory } from '../_models';

@Injectable()
export class TagService {

  constructor(protected http: HttpClient) {}

  private prepareChatCategory(data: any): ChatCategory {
    return {
      categories: data.categories,
      title: data.title,
      showTitle: data.showTitle,
    };
  }

  findTagsByWordPart(wordPart: string, limit: number): Observable<ChatCategory[]> {
    return this.http.get<any>(`${URLS.chatCategories}?term=${encodeURIComponent(wordPart)}`).pipe(
      map(answer => {
        const tags = answer['results'];
        let count = 0;
        return tags
          .filter((tag: any) => {
            const canReturn = count < limit;
            if (canReturn) {
              count++;
            }
            return canReturn;
          })
          .map((tag: any) => {
            const result = {
              ...tag
            };
            result.showTitle = result.title.replace(new RegExp('(' + regExpEscape(wordPart) + ')', 'gi'), '**$&**');
            return result;
          })
          .map((tag: any) => this.prepareChatCategory(tag));
      }));
  }
}

function regExpEscape(literal_string) {
    return literal_string.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
}
