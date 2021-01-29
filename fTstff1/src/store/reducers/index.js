import { combineReducers } from 'redux';

import loginUser from './login_user';
import toastReducer from './toastReducer';
import globalStore from '../global/reducer';

const reducer = combineReducers({
  global: globalStore,
  loginUser,
  toastReducer
});

export default reducer;
