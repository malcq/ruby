import { call, put } from 'redux-saga/effects';

import { retrieveCredentials, resolveAction, rejectAction } from '../wrappers';
import { requester, Logger } from "../../../utils";
import { sparSuccess, sparError } from '../../actionCreators';


export default function * (action: IPromisifiedAction): Iterator<any> {
  const { avatar } = action.payload;
  try{
    const credentials: ICredentials = yield retrieveCredentials();
    const formData = new FormData();
    formData.append('avatar', avatar, 'avatar.png');
    const response = yield call([requester, 'request'],{
      headers: {
        uid: credentials.uid,
        'access-token': credentials.accessToken,
        client: credentials.clientToken,
        'Content-Type': 'multipart/form-data',
      },
      method: 'PATCH',
      url: '/api/v1/account/avatar',
      data: formData,
    });
    yield resolveAction(action)
    // yield put(sparSuccess(response));
  } catch(error) {
    yield Logger.sagaError(error, 'store::user::getUserData');
    yield rejectAction(action, error);
    yield put(sparError(error));
  }
}