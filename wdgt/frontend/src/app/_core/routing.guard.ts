
import {map, switchMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable ,  of } from 'rxjs';

import { environment } from '../../environments/environment';

import { AuthenticationService, CurrentFeedbackService } from '../_services';

import { ROUTES } from '../config/router';

@Injectable()
export class RoutingGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private currentFeedbackService: CurrentFeedbackService,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
    return this.authenticationService.loggedIn()
      .pipe(
        switchMap(loggedIn => {
          if (!loggedIn) {
            return of(true);
          }
          return this.currentFeedbackService.get().pipe(
            map(feedback => {
            // let hasNotUploadedFiles = false;
            // (feedback.files || []).forEach(file => {
            //   if (file.needSendToServer) {
            //     hasNotUploadedFiles = true;
            //   }
            // });
            // const currentNextRoute: string = next.url[0].toString();
            // if (
            //   // feedback.feedbackCategory &&
            //   [
            //     // ROUTES.recordType,
            //     // ROUTES.audioRecord,
            //     // ROUTES.fileList,
            //     // ROUTES.upload,
            //     ROUTES.chat,
            //     // ROUTES.final,
            //   ].includes(currentNextRoute)
            // ) {
            //   return true;
            // }

            // let nextRoute: string = null;

            // if (feedback.feedbackCategory && currentNextRoute === ROUTES.summary) {
            //   if (!hasNotUploadedFiles) {
            //     return true;
            //   } else {
            //     nextRoute = ROUTES.upload;
            //   }
            // }

            // if (!nextRoute && feedback.chatDone) {
            //   nextRoute = ROUTES.summary;
            // }
            // if (!nextRoute && feedback.fileDone) {
            //   nextRoute = ROUTES.chat;
            // }
            // if (!nextRoute && feedback.feedbackCategory) {
            //   nextRoute = ROUTES.recordType;
            // }
            // if (!nextRoute) {
            //   nextRoute = ROUTES.login;
            // }
            // if (nextRoute && currentNextRoute !== nextRoute) {
            //   this.router.navigateByUrl('/' + nextRoute);
            //   return false;
            // }
            return true;
          }));
      }));
  }
}
