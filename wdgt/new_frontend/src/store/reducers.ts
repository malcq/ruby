import { combineReducers } from 'redux';

import userStore from './user/reducer';
import chatStore from './chat/reducer';
import widgetStore from './widget/reducer';

const rootReducer = combineReducers({
  userStore,
  chatStore,
  widgetStore,
});

export default rootReducer;
