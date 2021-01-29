import { AnyAction } from "redux";

import { authorizedRequest } from '../wrappers';
import { Logger } from '../../../utils';
import * as actionCreators from '../../actionCreators/searchOverview';
import {put} from "redux-saga/effects";
import {flashError} from "../../actionCreators/flash";
import {delay} from "redux-saga";

export default function * (action: AnyAction): Iterator<any> {
  try {
    const response = yield authorizedRequest({
      method: 'GET',
      url: 'api/v1/request_quotes/overview' + action.payload,
    });
    yield put(actionCreators.searchQuotesOverviewSuccess(response))
  } catch(error) {
    if (error.message === 'Network Error') {
      yield put(flashError('Something went wrong. Please try again. When the issue persists, please contact us on +31 85 066 0000.', 10000));
    }else {
      yield put(flashError(error.response.data.message, 4000));
    }
    yield delay(4000);
    // window.location.href = "/search" + action.payload.slice(0,action.payload.indexOf('route_id'));
    yield Logger.sagaError(error, 'store::user::loadState');
  }
}