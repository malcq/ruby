import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService } from '../_services/index';
import { ROUTES } from '../config/router';

@Injectable()
export class AuthRedirectGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authenticationService
      .loggedIn()
      .pipe(
        map(loggedIn => {
          if (!loggedIn) {
            this.router.navigateByUrl(`/${ROUTES.login}`);
            return false;
          }
          return true;
      })
    );
  }
}
