import { call, put } from 'redux-saga/effects';

import { requester, Logger } from '../../../utils';
import { userWithCredsSerializer } from '../../../utils/serializers';
import { userSignInSuccess } from '../../actionCreators';
import { rejectAction, resolveAction, storeCredentials, UserStorage } from '../wrappers';

export default function * (action: IPromisifiedAction): Iterator<any> {
  const { email, password, isRemembered } = action.payload;
  try {
    const response = yield call([requester, 'request'], {
      method: 'POST',
      url: 'api/auth/sign_in',
      data: { email, password }
    });
    const user = userWithCredsSerializer(response);
    yield put(userSignInSuccess(user));
    yield storeCredentials(user.uid, user.accessToken, user.clientToken, null);
    if (isRemembered) {
      yield UserStorage.setEmail(email);
    } else {
      yield UserStorage.removeEmail()
    }
    yield resolveAction(action, user)
  } catch(error) {
    yield Logger.sagaError(error, 'store::user::signIn');
    yield rejectAction(action, error);
  }
}