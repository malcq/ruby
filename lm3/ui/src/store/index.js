import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import appReducer, { actions as App } from './App';
import authReducer, { actions as Auth } from './Auth';
import adminReducer, { actions as Admin } from './Admin';
import userReducer, { actions as User } from './User';

const reducer = combineReducers({
  router: routerReducer,
  form: formReducer,

  app: appReducer,
  auth: authReducer,
  admin: adminReducer,
  user: userReducer,
});

export {
  reducer as default,

  App,
  Auth,
  Admin,
  User
};
