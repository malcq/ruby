import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable ,  throwError ,  of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { LocalStorageService } from '../app/_services';
import { AnswerPreparer } from '../app/_core/answer-preparer';
import { environment } from '../environments/environment';

@Injectable()
export class AnswerInterceptor implements HttpInterceptor {

  constructor(
    private localStorageService: LocalStorageService,
  ) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.lastIndexOf(environment.serverUrl) === 0) {
      return this.handleAccess(req, next);
    } else {
      return next.handle(req);
    }
  }

  public handleAccess(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.localStorageService
      .getItem('authToken')
      .pipe(
        switchMap(token => {
          if (token) {
            req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token)});
          }
          return next.handle(req)
        }),
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && event.status === 200) {
            if (event.body.error) {
              throwError(new Error(event.body.message));
            }
            event = event.clone({ body: AnswerPreparer.normaliseObjectNames(event.body) });
          }
          return event;
        }),
        catchError((err: any) => {
          if (err instanceof HttpErrorResponse) {
            const message = err.error.message || err.message;
            return throwError(new Error(message));
          }
          return throwError(err);
        })
      );
  }
}
