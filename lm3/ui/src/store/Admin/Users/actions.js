import { createAction } from 'redux-actions';

import get from 'lodash/get';

import SCHEMAS, { normalize } from 'lib/schema';

import { AdminUsersService } from 'services';

const fetchRequestStarted = createAction('ADMIN_USERS/FETCH_REUEST_STARTED');
const fetchRequestSuccessed = createAction('ADMIN_USERS/FETCH_REQUEST_SUCCESSED');
const fetchRequestFailed = createAction('ADMIN_USERS/FETCH_REQUEST_FAILED');

function fetch() {
  return async (dispatch, getState) => {
    const loading = get(getState(), 'admin.users.loading');
    const loaded = get(getState(), 'admin.users.loaded');

    if (loading || loaded) {
      return Promise.resolve();
    }

    dispatch(fetchRequestStarted());

    try {
      const { users, count } = await AdminUsersService.list();

      dispatch(fetchRequestSuccessed({
        ...normalize(users, SCHEMAS.USER_ARRAY, 'users'),
        count,
      }));
    } catch (error) {
      dispatch(fetchRequestFailed({ error: error.message }));
    }

    return Promise.resolve();
  };
}

const usersCreateRequestStarted = createAction('ADMIN_USERS/CREATE_REUEST_STARTED');
const usersCreateRequestSuccessed = createAction('ADMIN_USERS/CREATE_REQUEST_SUCCESSED');
const usersCreateRequestFailed = createAction('ADMIN_USERS/CREATE_REQUEST_FAILED');

function create(data) {
  return async dispatch => {
    dispatch(usersCreateRequestStarted());

    const user = await AdminUsersService.create(data);

    dispatch(usersCreateRequestSuccessed(normalize(user, SCHEMAS.USER, 'users')));
  };
}

const usersUpdateRequestStarted = createAction('ADMIN_USERS/UPDATE_REUEST_STARTED');
const usersUpdateRequestSuccessed = createAction('ADMIN_USERS/UPDATE_REQUEST_SUCCESSED');
const usersUpdateRequestFailed = createAction('ADMIN_USERS/UPDATE_REQUEST_FAILED');

function update(id, data) {
  return async dispatch => {
    dispatch(usersUpdateRequestStarted());

    const user = await AdminUsersService.update(id, data);

    dispatch(usersUpdateRequestSuccessed(normalize(user, SCHEMAS.USER, 'users')));
  };
}

const usersDeleteRequestStarted = createAction('ADMIN_USERS/DELETE_REUEST_STARTED');
const usersDeleteRequestSuccessed = createAction('ADMIN_USERS/DELETE_REQUEST_SUCCESSED');
const usersDeleteRequestFailed = createAction('ADMIN_USERS/DELETE_REQUEST_FAILED');

function destroy(id) {
  return async dispatch => {
    dispatch(usersDeleteRequestStarted());

    try {
      await AdminUsersService.delete(id);

      dispatch(usersDeleteRequestSuccessed({ id }));
    } catch (error) {
      dispatch(usersDeleteRequestFailed({ error }));
    }
  };
}

export {
  fetch,
  create,
  update,
  destroy,

  fetchRequestStarted,
  fetchRequestSuccessed,
  fetchRequestFailed,

  usersCreateRequestStarted,
  usersCreateRequestSuccessed,
  usersCreateRequestFailed,

  usersUpdateRequestStarted,
  usersUpdateRequestSuccessed,
  usersUpdateRequestFailed,

  usersDeleteRequestStarted,
  usersDeleteRequestSuccessed,
  usersDeleteRequestFailed,
};
