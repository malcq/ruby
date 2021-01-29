import { AnyAction } from "redux";
import { put } from 'redux-saga/effects';
import { userLoadRememberedSuccess } from '../../actionCreators/user';

import { rejectAction, resolveAction, UserStorage } from '../wrappers';
import { Logger } from '../../../utils';

export default function* (action: IPromisifiedAction): Iterator<any> {
  try {
    const email = yield UserStorage.getEmail();
    yield put(userLoadRememberedSuccess({ email }));
    yield resolveAction(action);
  } catch (error) {
    yield Logger.sagaError(error, 'store::user::loadRemembered');
    yield rejectAction(action, error);
  }
}