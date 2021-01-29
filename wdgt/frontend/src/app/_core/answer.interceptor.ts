
import {catchError, map, switchMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable ,  throwError ,  of } from 'rxjs';

import { CurrentFeedbackService, AuthenticationService } from '../_services';
import { AnswerPreparer } from './answer-preparer';
import { environment } from '../../environments/environment';

@Injectable()
export class AnswerInterceptor implements HttpInterceptor {

  constructor(
    private currentFeedbackService: CurrentFeedbackService,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.lastIndexOf(environment.serverUrl) === 0) {
      return this.handleAccess(req, next);
    } else {
      return next.handle(req);
    }
  }

  public handleAccess(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authenticationService.getToken().pipe(
      switchMap(token => {
        if (token) {
          req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token)});
        }
        return next.handle(req);
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
          if (
            (err.status === 403 && err.error.message !== 'Your account doesn\'t have access') ||
            (err.status === 401 && err.error.message === 'Auth required')
          ) {
            console.debug(err.error.message);

            this.currentFeedbackService.remove()
              .subscribe(() => this.router.navigateByUrl('/'));
          }
          const message = err.error.message || err.message;
          return throwError(new Error(message));
        }
        return throwError(err);
      }),);
  }
}
