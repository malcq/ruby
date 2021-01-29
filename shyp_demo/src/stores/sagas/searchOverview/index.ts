import { takeEvery } from "redux-saga/effects"

import * as actions from '../../actions/searchOverview';
import searchOverview from "./searchOverview";

export default function * (): Iterator<any> {
  yield takeEvery(actions.SEARCH_QUOTES_OVERVIEW, searchOverview);
}