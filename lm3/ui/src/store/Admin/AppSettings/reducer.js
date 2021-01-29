import { handleActions } from 'redux-actions';

import produce from 'immer';

import {
  fetchRequestStarted,
  fetchRequestSuccessed,
  fetchRequestFailed,
  settingsUpdateRequestSuccessed,
} from './actions';

const initialState = {
  settings: undefined,

  loading: false,
  loaded: false,
  error: null,
};

/* eslint-disable no-param-reassign */

export default handleActions({
  [fetchRequestStarted]: state => produce(state, next => {
    next.loading = true;
  }),

  [fetchRequestSuccessed]: (
    state,
    { payload: { settings } },
  ) => produce(state, next => {
    next.settings = settings;

    next.loading = false;
    next.loaded = true;
    next.error = null;
  }),

  [fetchRequestFailed]: (
    state,
    { payload: { error } },
  ) => produce(state, next => {
    next.error = error;

    next.loading = false;
    next.loaded = false;
  }),

  [settingsUpdateRequestSuccessed]: (
    state,
    { payload: { type, settings } },
  ) => produce(state, next => {
    next.settings[type] = settings;
  }),
}, initialState);
