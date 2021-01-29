import { ActionCreator,AnyAction } from "redux";

import { authorizedRequest } from '../wrappers';
import { Logger } from '../../../utils';
import * as actionCreators from '../../actionCreators/searchPrevious';
import {put} from "redux-saga/effects";
import {flashError} from "../../actionCreators/flash";

export default function * (action: AnyAction): Iterator<any> {
  try {
    const response = yield authorizedRequest({
      method: 'GET',
      url: 'api/v1/request_quotes/previous_searches',
    });
    yield put(actionCreators.searchPreviousSuccess(response))
  } catch(error) {
    yield put(flashError(error.response.data.message, 4000))
    yield Logger.sagaError(error, 'store::user::loadState');
  }
}