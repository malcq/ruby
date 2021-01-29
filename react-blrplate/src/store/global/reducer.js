import {
  UPDATE_USER_IN_STORE,
  UPDATE_SPINNER_STATUS,
  UPDATE_THEME
} from './actionNames';
import { REFRESH_WHOLE_STORE } from '../actionNames';

const initialStore = () => ({
  user: undefined,
  spinner: false,
  theme: 'general'
});

export default (store = initialStore(), { type, data } = {}) => {
  switch (type) {
    case REFRESH_WHOLE_STORE:
      return initialStore();

    case UPDATE_USER_IN_STORE:
      return {
        ...store,
        user: data
      };

    case UPDATE_SPINNER_STATUS:
      return {
        ...store,
        spinner: typeof data === 'boolean' ? data : !store.spinner
      };

    case UPDATE_THEME:
      return {
        ...store,
        theme: data
      };

    default:
      return store;
  }
};
