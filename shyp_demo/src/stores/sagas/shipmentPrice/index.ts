import { takeEvery } from 'redux-saga/effects';

import * as actions from '../../actions/shipmentPrice';
import * as actionCreators from '../../actionCreators/shipmentPrice';
import { simpleGetAndResolve } from '../factories';

const getPrice = simpleGetAndResolve(
  (action) => `/api/v1/shipments/${action.id}/costs`,
  actionCreators.shipmentPriceGetDataSuccess,
  (response) => response.data.data,
);

export default function * (): Iterator<any> {
  yield takeEvery(actions.SHIPMENT_PRICE_GET_DATA, getPrice);
}