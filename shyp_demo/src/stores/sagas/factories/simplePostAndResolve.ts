import { put } from 'redux-saga/effects';

import { authorizedRequest, rejectAction, resolveAction } from '../wrappers';
import { Logger } from '../../../utils';
import { ActionCreator, AnyAction } from "redux";
import { AxiosResponse } from "axios";
import { sparSuccess, sparError, flashError } from '../../actionCreators';

const getData: IResponseSerializer = (response: AxiosResponse) => response.data;

// Factory for standartized put request. Action should have payload which is compatible with
// server api. Resolves with updated data, which can be serialized
export default (
  makeUrl: (action: AnyAction) => string,
  actionCreator: ActionCreator<AnyAction>,
  serializer?: IResponseSerializer,
  emitMessage?: boolean
): ISaga1<IPromisifiedAction> => function * (action: IPromisifiedAction): Iterator<any> {
  try{
    const response = yield authorizedRequest({
      method: 'POST',
      data: action.payload,
      url: makeUrl(action),
    });
    yield put(actionCreator(serializer ? serializer(response) : response));
    yield resolveAction(action);
    if (emitMessage) {
      yield put(sparSuccess(response))
    }
  } catch(error) {
    yield Logger.sagaError(error, 'store::user::simplePostAndResolve');
    yield rejectAction(action, error);
    if (error.message === 'Network Error') {
      yield put(flashError('Something went wrong. Please try again. When the issue persists, please contact us on +31 85 066 0000.'));
    }
    if (emitMessage) {
      yield put(sparError(error));
    }
  }
}
