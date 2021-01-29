import { call, put } from 'redux-saga/effects';

import * as actionCreators from '../../actionCreators';
import { Logger, requester } from '../../../utils';

export default function * (action: IPromisifiedAction): Iterator<any> {
  try{
    const response = yield call([requester, 'request'], {
      method: 'POST',
      url: '/api/auth/password',
      data: action.payload,
    });
    yield put(actionCreators.userForgotPasswordSuccess());
  } catch(error) {
    yield Logger.sagaError(error, 'store::saga::forgot-password');
    yield put(actionCreators.userForgotPasswordSuccess());
  }
}
