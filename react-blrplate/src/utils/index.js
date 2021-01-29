import store from 'store';

import { refreshWholeStore } from 'store/actions';
import protector from './protector';

export { protector };

export const logOut = () => {
  // Remove your token here
  store.dispatch(refreshWholeStore());
};
