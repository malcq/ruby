import { handleActions } from 'redux-actions';

import produce from 'immer';

import pull from 'lodash/pull';

import {
  fetchRequestStarted,
  fetchRequestSuccessed,
  fetchRequestFailed,
  usersCreateRequestSuccessed,
  usersUpdateRequestSuccessed,
  usersDeleteRequestSuccessed,
} from './actions';

const initialState = {
  byId: {},
  ids: [],
  total: 0,

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
    { payload: { byId, ids, count } },
  ) => produce(state, next => {
    next.byId = byId;
    next.ids = ids;
    next.total = count;

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

  [usersCreateRequestSuccessed]: (
    state,
    { payload: { byId, ids } },
  ) => produce(state, next => {
    next.byId = { ...byId, ...state.byId };
    next.ids = [ids, ...state.ids];

    next.total += 1;
  }),

  [usersUpdateRequestSuccessed]: (
    state,
    { payload: { byId } },
  ) => produce(state, next => {
    next.byId = { ...state.byId, ...byId };
  }),

  [usersDeleteRequestSuccessed]: (
    state,
    { payload: { id } },
  ) => produce(state, next => {
    const { [id]: _, ...byId } = state.byId;

    next.byId = byId;
    next.ids = [...pull(state.ids, id)];

    next.total -= 1;
  }),
}, initialState);

/* eslint-enable no-param-reassign */
