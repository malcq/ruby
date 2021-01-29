import { AnyAction } from "redux";
import { get } from 'lodash';
import { put, select, take } from "redux-saga/effects";
import { replace } from 'react-router-redux';

import { flashError } from '../../actionCreators';
import { USER_LOAD_STATE_SUCCESS } from '../../actions/user';
import { isRouteAllowed } from '../../../config/permissions';
import { DEFAULT_PAGE } from '../../../config/constants';


const isLoading = (state: IGlobalState): boolean => state.user.loading;

const getPermission = (state: IGlobalState): string => state.user.permission;

// This protects URLs from users with restricted access
export default function * (action: AnyAction): Iterator<any> {

  const loading = yield select(isLoading);

  if (loading) {
    yield take(USER_LOAD_STATE_SUCCESS);
  }

  const path = get(action.payload, 'pathname', '');
  const permission = yield select(getPermission);

  if (!isRouteAllowed(path, permission)) {
    yield put(replace(DEFAULT_PAGE));
    yield put(flashError('Sorry, but access to this page is restricted', 3000 /* 3 sec */))
  }
}