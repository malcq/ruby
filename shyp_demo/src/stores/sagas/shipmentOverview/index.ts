import { takeEvery } from 'redux-saga/effects';

import * as actions from '../../actions/shipmentOverview';
import * as actionCreators from '../../actionCreators/shipmentOverview';
import { simpleGetAndResolve, simplePutAndResolve, simplePatchAndResolve } from '../factories';
import { shipmentOverviewSerializer } from '../../../utils/serializers';

const getShipment = simpleGetAndResolve(
  (action) => `/api/v1/shipments/${action.id}/overview`,
  actionCreators.shipmentOverviewGetDataSuccess,
  shipmentOverviewSerializer,
);

const submitShipmentData = simplePutAndResolve(
  (action) => `/api/v1/shipments/${action.id}`,
  actionCreators.shipmentOverviewSubmitDataSuccess,
  shipmentOverviewSerializer,
);

const shipmentOverviewUnpinMessage = simplePatchAndResolve(
  (action) => `/api/v1/shipments/${action.shipmentId}/chat_comments/${action.messageId}/unpin`,
  actionCreators.shipmentOverviewUnpinMessageSuccess,
  (response) => response.data,
);

export default function * (): Iterator<any> {
  yield takeEvery(actions.SHIPMENT_OVERVIEW_GET_DATA, getShipment);
  yield takeEvery(actions.SUBMIT_SHIPMENT_OVERVIEW_DATA, submitShipmentData);
  yield takeEvery(actions.SHIPMENT_OVERVIEW_UNPIN_MESSAGE, shipmentOverviewUnpinMessage);
}