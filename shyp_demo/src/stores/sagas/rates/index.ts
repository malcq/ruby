import { takeLatest } from 'redux-saga/effects';

import * as actions from '../../actions/rates';
import * as actionCreators from '../../actionCreators/rates';
import { simpleGetAndResolve } from '../factories';

const getRates = simpleGetAndResolve(
  () => '/api/v1/rates',
  actionCreators.ratesGetDataSuccess,
  request => request.data.data,
);

export default function * (): Iterator<any> {
  yield takeLatest(actions.RATES_GET_DATA, getRates);
}