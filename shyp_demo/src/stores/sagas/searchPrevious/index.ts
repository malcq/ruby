import { takeEvery } from "redux-saga/effects"

import * as actions from '../../actions/searchPrevious';
import * as sactions from '../../actions/searches';
import searchPrevious from "./searchPrevious";

export default function * (): Iterator<any> {
  yield takeEvery(actions.SEARCH_PREVIOUS, searchPrevious);
  yield takeEvery(sactions.SEARCH_QUOTES, searchPrevious);
}