import { takeEvery } from 'redux-saga/effects';

import * as actions from '../../actions/shipmentLayout';
import * as actionCreators from '../../actionCreators/shipmentLayout';
import {
  simpleDeleteAndResolve,
  simpleGetAndResolve,
  simplePatchAndResolve
} from '../factories';
import { shipmentOverviewSerializer } from '../../../utils/serializers';

const getShipmentLayoutData = simpleGetAndResolve(
  (action) => `/api/v1/shipments/${action.id}/layout_data`,
  actionCreators.shipmentLayoutGetDataSuccess,
  (response) => response.data,
);

const deleteShipment = simpleDeleteAndResolve(
  (action) => `/api/v1/shipments/${action.id}/`,
  actionCreators.shipmentLayoutDeleteShipmentSuccess,
  (response) => response.data,
);

const acceptQuote = simplePatchAndResolve(
  (action) => `/api/v1/shipments/${action.id}/accept_quote`,
  actionCreators.shipmentLayoutAcceptQuoteSuccess,
  shipmentOverviewSerializer,
);

export default function * (): Iterator<any> {
  yield takeEvery(actions.SHIPMENT_LAYOUT_GET_DATA, getShipmentLayoutData);
  yield takeEvery(actions.SHIPMENT_LAYOUT_DELETE_SHIPMENT, deleteShipment);
  yield takeEvery(actions.SHIPMENT_LAYOUT_ACCEPT_QUOTE, acceptQuote);
}