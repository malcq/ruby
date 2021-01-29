import { takeEvery } from "redux-saga/effects"

import * as actions from '../../actions/searches';
import * as actionCreators from '../../actionCreators/searches';
import searchQuotes from "./searchQuotes";

export default function * (): Iterator<any> {
  yield takeEvery(actions.SEARCH_QUOTES, searchQuotes);
}