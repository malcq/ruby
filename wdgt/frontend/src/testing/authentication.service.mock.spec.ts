import { of } from 'rxjs/observable/of';

export const authenticationServiceMock = jasmine.createSpyObj('AuthenticationService', [
  'logout',
  'signup',
  'loggedIn',
  'addOnLogoutListener',
]);
authenticationServiceMock.loggedIn.and.returnValue(true);
authenticationServiceMock.signup.and.returnValue( of(true) );

