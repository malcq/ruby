import { combineReducers } from 'redux';

import globalStore from 'store/global/reducer';

export default combineReducers({
  // eslint-disable-next-line object-curly-newline
  global: globalStore
});
