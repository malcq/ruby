import { replace } from 'react-router-redux';
import { connectedReduxRedirect } from "redux-auth-wrapper/history4/redirect"

import { isAuth } from '../stores/selectors';

export default connectedReduxRedirect<any>({
  redirectPath: '/login',
  authenticatedSelector: isAuth,
  wrapperDisplayName: 'UserIsAuthenticated',
  allowRedirectBack: true,
  redirectAction: replace,
})
