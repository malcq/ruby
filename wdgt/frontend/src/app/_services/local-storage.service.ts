
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Observable ,  from ,  of } from 'rxjs';

import {
  localStorageMethod,
  initLocalStorage,
} from '../_parent/local-storage';

import { ParentService } from './parent.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(
    private parentService: ParentService
  ) {
    initLocalStorage();
  }

  setItem(name: string, value: any): Observable<void> {
    return from(
      this.parentService.send(localStorageMethod.setItem, {info: {name, value}})
        .then(() => {})
    );
  }

  getItem(name: string): Observable<string> {
    return from(this.getItemP(name));
  }

  getItemP(name: string): Promise<string> {
    return this.parentService.send(localStorageMethod.getItem, {info: {name}})
      .then(message => message.info);
  }

  removeItem(name: string): Observable<void> {
    return from(
      this.parentService.send(localStorageMethod.removeItem, {info: {name}})
        .then(() => {})
    );
  }

  getObject(name: string, defaultValue: any = null): Observable<any> {
    return this.getItem(name).pipe(
      map((value: string) => {
        if (value === null || value === 'undefined' || value === undefined) {
          return defaultValue;
        }

        let result = value;
        try {
          result = JSON.parse(value);
        } catch (err) {}

        return result;
      }));
  }
}
