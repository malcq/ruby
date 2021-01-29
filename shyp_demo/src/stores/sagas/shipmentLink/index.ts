import { takeEvery } from 'redux-saga/effects';

import * as actions from '../../actions/shipmentLink';
import * as actionCreators from '../../actionCreators/shipmentLink';
import { simpleGetAndResolve } from '../factories';

const getShipment = simpleGetAndResolve(
  (action) => `/api/v1/public_maps/${action.id}`,
  actionCreators.shipmentLinkGetDataSuccess,
  (response) => response.data.data,
);

export default function * (): Iterator<any> {
  yield takeEvery(actions.SHIPMENT_LINK_GET_DATA, getShipment);
}