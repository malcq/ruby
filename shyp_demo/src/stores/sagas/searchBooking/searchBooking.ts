import { ActionCreator,AnyAction } from "redux";

import { authorizedRequest } from '../wrappers';
import { Logger } from '../../../utils';
import * as actionCreators from '../../actionCreators/searchBooking';
import {put, select} from "redux-saga/effects";
import credentialsSelector from "../wrappers/credentialsSelector";
import {baseURL} from "../../../config/local.json";
import {flashError} from "../../actionCreators/flash";

export default function * (action: AnyAction): Iterator<any> {
  try {
    const response = yield authorizedRequest({
      method: 'POST',
      url: 'api/v1/request_quotes/complete' + action.payload,
    });
    const creds = yield select(credentialsSelector);
    if(creds.uid === "admin@shypple.com") {
      window.location.href = baseURL + "/admin/shipments/" + response.data.data.id + "/edit";
    } else {
      yield put(actionCreators.searchQuotesBookingSuccess(response))
    }
  } catch(error) {
    if (error.message === 'Network Error') {
      yield put(flashError('Something went wrong. Please try again. When the issue persists, please contact us on +31 85 066 0000.', 10000));
    }else {
      yield put(flashError(error.response.data.message, 4000));
    }
    yield put(actionCreators.searchQuotesBookingReset());
    yield Logger.sagaError(error, 'store::user::loadState');
  }
}