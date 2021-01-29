import { takeEvery } from 'redux-saga/effects';

import * as actions from '../../actions/shipmentInstructions';
import * as actionCreators from '../../actionCreators/shipmentInstructions';
import { simpleGetAndResolve, simplePutAndResolve } from '../factories';

const getInstructions = simpleGetAndResolve(
  (action) => `/api/v1/shipments/${action.id}/shipping_instructions`,
  actionCreators.shipmentInstructionsGetDataSuccess,
  (response) => response.data.data,
);

const submitInstructionsConsigneeData = simplePutAndResolve(
  (action) => `/api/v1/shipments/${action.id}/shipping_instructions/consignee`,
  actionCreators.shipmentInstructionsPutDataSuccess,
  (response) => response.data.data,
);

const submitInstructionsConsigneeContactData = simplePutAndResolve(
  (action) => `/api/v1/shipments/${action.id}/shipping_instructions/consignee_contact`,
  actionCreators.shipmentInstructionsPutDataSuccess,
  (response) => response.data.data,
);

const submitInstructionsShipperData = simplePutAndResolve(
  (action) => `/api/v1/shipments/${action.id}/shipping_instructions/shipper`,
  actionCreators.shipmentInstructionsPutDataSuccess,
  (response) => response.data.data,
);

const submitInstructionsShipperContactData = simplePutAndResolve(
  (action) => `/api/v1/shipments/${action.id}/shipping_instructions/shipper_contact`,
  actionCreators.shipmentInstructionsPutDataSuccess,
  (response) => response.data.data,
);

const submitInstructionsNotifyPartyData = simplePutAndResolve(
  (action) => `/api/v1/shipments/${action.id}/shipping_instructions/notify_party`,
  actionCreators.shipmentInstructionsPutDataSuccess,
  (response) => response.data.data,
);


export default function * (): Iterator<any> {
  yield takeEvery(actions.SHIPMENT_INSTRUCTIONS_GET_DATA, getInstructions);
  yield takeEvery(actions.SHIPMENT_INSTRUCTIONS_SUBMIT_CONSIGNEE_DATA, submitInstructionsConsigneeData);
  yield takeEvery(actions.SHIPMENT_INSTRUCTIONS_SUBMIT_CONSIGNEE_CONTACT_DATA, submitInstructionsConsigneeContactData);
  yield takeEvery(actions.SHIPMENT_INSTRUCTIONS_SUBMIT_SHIPPER_DATA, submitInstructionsShipperData);
  yield takeEvery(actions.SHIPMENT_INSTRUCTIONS_SUBMIT_SHIPPER_CONTACT_DATA, submitInstructionsShipperContactData);
  yield takeEvery(actions.SHIPMENT_INSTRUCTIONS_SUBMIT_NOTIFY_PARTY_DATA, submitInstructionsNotifyPartyData);
}