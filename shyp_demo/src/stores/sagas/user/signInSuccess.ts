import { put, select } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import { parse } from 'query-string'

import { DEFAULT_PAGE } from "../../../config/constants";

function getRedirectPath(state: IGlobalState): string {
  const routing: any = state.routing || {};
  const location: any = routing.location || {};
  const redirect = parse(location.search).redirect;
  if (!redirect){
    if (location.pathname === '/login') {
      return DEFAULT_PAGE;
    }
    return '';
  }
  return redirect;
}

export default function * (): Iterator<any> {
  const redirectUrl = yield select(getRedirectPath);
  if (redirectUrl) {
    yield put(replace({ pathname: redirectUrl }));
  }
}