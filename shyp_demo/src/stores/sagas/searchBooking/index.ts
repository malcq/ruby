import { takeEvery } from "redux-saga/effects"

import * as actions from '../../actions/searchBooking';
import searchBooking from "./searchBooking";

export default function * (): Iterator<any> {
  yield takeEvery(actions.SEARCH_QUOTES_BOOKING, searchBooking);
}