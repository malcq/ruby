import { takeEvery } from 'redux-saga/effects';

import * as actions from '../../actions/quotes';
import * as actionCreators from '../../actionCreators/quotes';
import { simpleGetAndResolve } from '../factories';

const getQuotes = simpleGetAndResolve(
  ()=>'/api/v1/quotes/',
  actionCreators.quotesGetDataSuccess,
  request => request.data.data.quotes,
);

export default function* (): Iterator<any> {
  yield takeEvery(actions.QUOTES_GET_DATA, getQuotes);
}