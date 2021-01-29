
import {switchMap, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable ,  of ,  forkJoin } from 'rxjs';

import { URLS } from '../config/api';

import { LocalStorageService } from './local-storage.service';

import { User } from '../_models';

@Injectable()
export class UserService {
  private current:  User;

  constructor(
    protected http: HttpClient,
    private localStorageService: LocalStorageService,
  ) {}

  getCurrent(reload = false): Observable<User> {
    if (!this.current || reload) {
      return this.http.get<any>(`${URLS.userMe}`).pipe(
        switchMap(answer => {
          return this.prepareUser(answer['user']);
        }));
    } else {
      return of(this.current);
    }
  }

  prepareUser(data: any): Observable<User> {
    const user = {
      ...data
    };

    return forkJoin([
      this.localStorageService.getItem('userName'),
      this.localStorageService.getItem('userEmail'),
    ]).pipe(
      map(([name, email]) => {
        user.name = name;
        user.email = email;
        this.current = user;
        return user;
      }));
  }

  updateInfoForCurrent(fullName: string, email: string): Observable<any> {
    return forkJoin([
      this.updateLocalName(fullName),
      this.updateLocalEmail(email),
    ]).pipe(
      switchMap(() => {
        const data = { name: fullName, email };
        return this.http.put<any>(`${URLS.userUpdateInfo}`, data);
      }),
      switchMap(() => this.getCurrent(true)),
      map(() => true),);
  }

  get(id: number): Observable<User> {
    return this.http.get<any>(`${URLS.user}/${id}`).pipe(
      map(answer => answer['user']));
  }

  updateLocalName(fullName): Observable<void> {
    return this.localStorageService.setItem('userName', fullName);
  }

  updateLocalEmail(email): Observable<void> {
    return this.localStorageService.setItem('userEmail', email);
  }
}
