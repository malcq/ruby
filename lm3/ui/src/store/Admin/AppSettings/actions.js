import { createAction } from 'redux-actions';

import get from 'lodash/get';

import { AdminAppSettingsService } from 'services';

const fetchRequestStarted = createAction('ADMIN_APP_SETTINGS/FETCH_REQUEST_STARTED');
const fetchRequestSuccessed = createAction('ADMIN_APP_SETTINGS/FETCH_REQUEST_SUCCESSED');
const fetchRequestFailed = createAction('ADMIN_APP_SETTINGS/FETCH_REQUEST_FAILED');

function fetch() {
  return async (dispatch, getState) => {
    const loading = get(getState(), 'admin.appSettings.loading');
    const loaded = get(getState(), 'admin.appSettings.loaded');

    if (loading || loaded) {
      return Promise.resolve();
    }

    dispatch(fetchRequestStarted());

    try {
      const { settings } = await AdminAppSettingsService.fetch();

      dispatch(fetchRequestSuccessed({ settings }));
    } catch (error) {
      dispatch(fetchRequestFailed({ error: error.message }));
    }

    return Promise.resolve();
  };
}

const settingsUpdateRequestStarted = createAction('ADMIN_APP_SETTINGS/UPDATE_REQUEST_STARTED');
const settingsUpdateRequestSuccessed = createAction('ADMIN_APP_SETTINGS/UPDATE_REQUEST_SUCCESSED');

function update(type, data) {
  return async dispatch => {
    dispatch(settingsUpdateRequestStarted());

    const { settings } = await AdminAppSettingsService.update(type, data);

    dispatch(settingsUpdateRequestSuccessed({ type, settings }));
  };
}

export {
  fetch,
  update,

  fetchRequestStarted,
  fetchRequestSuccessed,
  fetchRequestFailed,

  settingsUpdateRequestStarted,
  settingsUpdateRequestSuccessed,
};
