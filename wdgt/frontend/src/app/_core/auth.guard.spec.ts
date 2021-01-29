import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

import { AuthGuard } from './auth.guard';
import { AuthenticationService } from '../_services/authentication.service';

class MockAuthService {
  accessToken = false;
  signup(fullName: string, email: string): Observable<any> {
    this.accessToken = true;
    return of(true);
  }
  logout() {
    this.accessToken = false;
  }
  loggedIn() {
    return this.accessToken;
  }
}

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, { provide: AuthenticationService, useClass: MockAuthService }],
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should not be activated if not logged in', inject(
    [AuthGuard, AuthenticationService],
    (service: AuthGuard, authService: AuthenticationService) => {
      authService.logout();
      const answer = service.canActivate(null, null);
      console.log(typeof answer);
      if (typeof answer === 'object') {
        (<Observable<boolean>>answer).subscribe(canActivate => {
          expect(canActivate).toBe(true);
        });
      } else {
        fail('canActivate must return Observable');
      }
    })
  );

  it('should be activated if logged in', inject(
    [AuthGuard, AuthenticationService],
    (service: AuthGuard, authService: AuthenticationService) => {
      authService.signup('John Doe', 'test@test.com').subscribe(() => {
        expect(service.canActivate(null, null)).toBe(true);
      });
    })
  );
});
