import { call, put, select } from 'redux-saga/effects';
import { parse } from 'query-string';
import { get } from 'lodash';

import { rejectAction, resolveAction } from '../wrappers';
import { requester, Logger } from '../../../utils';
import { flashSuccess, flashError } from '../../actionCreators';

const getSearch = (state: IGlobalState) => get(state.routing, 'location.search', '');

export default function * (action: IPromisifiedAction): Iterator<any> {
  try{
    const searchString = yield select(getSearch);
    const search = parse(searchString);
    const response = yield call([requester, 'request'], {
      headers: {
        uid: search.uid,
        'access-token': search['access-token'],
        client: search.client,
      },
      method: 'PUT',
      data: { password: action.payload.password, password_confirmation: action.payload.password_confirmation},
      url: '/api/auth/password',
    });
    yield put(flashSuccess(get(response, 'data.message', 'Password successfully changed'), 8000/* 8 sec*/));
    yield resolveAction(action);
  } catch(error) {
    yield Logger.sagaError(error, 'store::user::submitUserData');
    yield rejectAction(action, error);
    yield put(flashError(get(
      error, 'response.data.message',
      'Error occurred during password change'
    )));
  }
}
