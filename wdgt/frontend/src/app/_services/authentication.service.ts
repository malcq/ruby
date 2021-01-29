import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  Observable,
  from,
  of,
  throwError ,
  forkJoin,
} from 'rxjs';
import {mergeMap, map,  switchMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { URLS } from '../config/api';

import { UserService } from './user.service';
import { LocalStorageService } from './local-storage.service';
import { CompanyService } from './company.service';
import { ProductModel, Feedback, Company } from '../_models';

@Injectable()
export class AuthenticationService {
  private authToken: string;
  private authTokenPromise: Promise<string>;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private companyService: CompanyService,
  ) { }

  login(email: string, password: string): Observable<void> {
    const data = {email, password};
    return this.http.post<any>(URLS.signUp, data).pipe(
      switchMap(this.checkLogin));
  }

  /**
   * ⚠️ It uses mocked productModel
   * TODO: Remove mock data
   */
  signInByHash(code: string, country: string): Observable<any> {
    const data = { code, country };

    let loginResponse = null;
    let sessionResponse = null;

    return this.http
      .post<any>(URLS.signInWidget, data)
      .pipe(
        switchMap((response) => {
          loginResponse = response;
          return this.checkLogin(response);
        }),
        switchMap((response) => {
          return this.createSession();
        }),
        map((response) => {
          sessionResponse = response;
          return {
            sessionId: sessionResponse.feedbackSession.id,
            // ⚠️ mocked product model below
            productModel: {
              id: null,
              productId: 121,
              title: 'Contact us',
              image: null,
            }
          }
        })
      );
  }

  signinByProductId(productId: number, company: Company, country: string): Observable<any> {
    const data = {company_id: company.id, product_id: productId, country};
    return this.http.post<any>(URLS.signUp, data).pipe(
      switchMap(answer => {
        return this.checkLogin(answer).pipe(
          map(() => ({sessionId: answer.sessionId, productModel: {
            id: null,
            productId: answer.result.id,
            title: answer.result.title,
            image: null
          }})));
      }));
  }

  signup(fullName: string, email: string): Observable<void> {
    return this.companyService
      .getAsync()
      .pipe(
        switchMap((company: Company) => {
          const data = {
            company_id: company.id,
            name: fullName,
            role: 'user_restricted',
            email,
          };

          return forkJoin([
            this.http.post<any>(URLS.signUp, data),
            this.localStorageService.setItem('userName', fullName)
          ]);
        }),
        switchMap(
          ([answer]) => this.checkLogin(answer)
        )
      );
  }

  signinByCampaignCode(code: string): Observable<any> {
    const data = { code };
    return this.http.post<any>(URLS.signInCampaign, data).pipe(
      switchMap(answer => {
        return this.checkLogin(answer).pipe(
          map(() => answer));
      }));
  }

  private checkLogin(answer: any): Observable<void> {
    if (answer && answer.token) {
        return this.setToken(answer.token);
      } else {
        return throwError(new Error('Login failed'));
      }
  }

  updateName(name: string, sessionId: string): Observable<void> {
    return this.userService.updateLocalName(name).pipe(
      switchMap(() => {
        const data = { name, session_id: sessionId };
        return this.http.put(URLS.setName, data);
      }),
      switchMap(() => this.userService.getCurrent(true)),
      map(() => {}),);
  }

  updateEmail(email: string, sessionId: string): Observable<void> {
    return this.userService.updateLocalEmail(email).pipe(
      mergeMap(() => {
        console.debug('updated');
        const data = { email, session_id: sessionId };
        return this.http.put(URLS.setEmail, data);
      }),
      mergeMap((answer: any): Observable<void> => {
        console.debug('sended to server');
        return (answer && answer.token)? this.setToken(answer.token): of(null);
      }),
      mergeMap(() => {
        console.debug('token saved');
        return this.userService.getCurrent(true);
      }),
      map(() => {console.debug('done');}),);
  }

  loggedIn(): Observable<boolean> {
    return this.getToken().pipe(
      map(token => (token != null)));
  }

  logout(): Observable<void> {
    this.authToken = null;
    return this.localStorageService.removeItem('authToken');
  }

  createSession(): Observable<any> {
    const data = {};
    return this.http.post(URLS.feedbackSession, data);
  }

  getToken(): Observable<string> {
    if(this.authToken) {
      return of(this.authToken)
    } else {
      if(!this.authTokenPromise) {
        this.authTokenPromise = this.localStorageService.getItemP('authToken').then(token => {
          this.authToken = token;
          this.authTokenPromise = null;
          return token;
        });
      }
      return from(this.authTokenPromise);
    }
  }

  setToken(token: string): Observable<void> {
    this.authToken = token;
    return this.localStorageService.setItem('authToken', token);
  }
}
