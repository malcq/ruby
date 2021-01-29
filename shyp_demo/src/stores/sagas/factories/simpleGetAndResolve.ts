import { put } from 'redux-saga/effects';

import { authorizedRequest, resolveAction, rejectAction } from '../wrappers';
import { Logger } from "../../../utils";
import { ActionCreator, AnyAction } from "redux";
import { AxiosResponse } from "axios";
import { flashError } from '../../actionCreators';

const getData: IResponseSerializer = (response: AxiosResponse) => response.data;

// Factory creating saga, which does simple get request and resolving promisified action
// Action may contain payload. If it does, it will be converted to query parameters of the request
// If action contains id property, request would be to 'url/id'
export default (
  makeUrl: (action: AnyAction) => string,
  actionCreator: ActionCreator<AnyAction>,
  serializer?: IResponseSerializer,
): ISaga1<IPromisifiedAction> =>
  function* (action: IPromisifiedAction): Iterator<any> {
    try{
      const response = yield authorizedRequest({
        method: 'GET',
        url: makeUrl(action),
        params: action.payload || null,
      });
      yield put(actionCreator(serializer ? serializer(response) : response));
      yield resolveAction(action)
    } catch(error) {
      yield Logger.sagaError(error, 'store::factories::simpleGetAndResolve');
      if (error.message === 'Network Error') {
        yield put(flashError('Something went wrong. Please try again. When the issue persists, please contact us on +31 85 066 0000.'));
      }
      yield rejectAction(action, error)
    }
  }