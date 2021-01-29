import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable ,  of } from 'rxjs';

import { AuthenticationService } from '../_services/index';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
    return this.authenticationService.loggedIn()
      .pipe(
        switchMap(loggedIn => {
          if (!loggedIn) {
            const fullName = 'John Doe';
            const randomName = Math.random().toString(36).substr(2, 10) + Math.random().toString(36).substr(2, 10);
            const email = `${randomName}_mobile@test.com`;
  
            return this.authenticationService.signup(fullName, email).pipe(
              map(() => true));
          }
          return of(true);
        })
      )
  }
}
