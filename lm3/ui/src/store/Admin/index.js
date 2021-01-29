import { combineReducers } from 'redux';

import appSettingsReducer, { actions as AppSettings } from './AppSettings';
import usersReducer, { actions as Users } from './Users';

const reducer = combineReducers({
  appSettings: appSettingsReducer,
  users: usersReducer,
});

const actions = {
  AppSettings,
  Users,
};

export {
  reducer as default,
  actions,
};
