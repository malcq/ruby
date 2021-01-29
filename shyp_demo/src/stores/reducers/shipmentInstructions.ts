import { createReducer, Reducer } from 'redux-create-reducer';

import * as actions from '../actions/shipmentInstructions';
import { AnyAction } from "redux";
import { unionBy } from 'lodash';

declare global{
  interface IShipmentInstructionsState{
    data: {
      contact_details_valid: boolean,
      show_consignee_company: boolean,
      show_consignee_contact: boolean,
      show_shipper_company: boolean,
      show_notify_party: boolean,
      is_export: boolean,
      contacts: any[],
      consignee: any,
      shipper: any,
      shipper_contact: any,
      consignee_contact: any,
      notify_party: any,
    },
  }
}
export const initialShipmentInstructionsState = {
  data: {
    contact_details_valid: false,
    show_consignee_company: false,
    show_consignee_contact: false,
    show_shipper_company: false,
    show_notify_party: false,
    show_shipper_contact: false,
    is_export: false,
    contacts: [],
    consignee: {},
    shipper: {},
    shipper_contact: {},
    consignee_contact: {},
    notify_party: {},
  },
};

const saveReceivedInstructionsData: Reducer<IShipmentInstructionsState, AnyAction> = (state, action) => ({
  ...state,
  data: assignValues(state, action)
});

const assignValues = (state, action) => {
  const data = state.data;
  if (action.payload.consignee) { data.consignee = action.payload.consignee }
  if (action.payload.consignee_contact) { data.consignee_contact = action.payload.consignee_contact }
  if (action.payload.shipper) { data.shipper = action.payload.shipper }
  if (action.payload.notify_party) { data.notify_party = action.payload.notify_party }
  if (action.payload.shipper_contact) { data.shipper_contact = action.payload.shipper_contact }
  return data;
};


const receiveList: Reducer<IShipmentInstructionsState, AnyAction> = (state, action) => ({
  ...state,
  data: action.payload,
});

export default createReducer(initialShipmentInstructionsState, {
  [actions.SHIPMENT_INSTRUCTIONS_GET_DATA_SUCCESS]: receiveList,
  [actions.SHIPMENT_INSTRUCTIONS_UPDATE_DATA]: saveReceivedInstructionsData,
  [actions.SHIPMENT_INSTRUCTIONS_SUBMIT_CONSIGNEE_CONTACT_DATA]: saveReceivedInstructionsData,
  [actions.SHIPMENT_INSTRUCTIONS_SUBMIT_SHIPPER_DATA]: saveReceivedInstructionsData,
  [actions.SHIPMENT_INSTRUCTIONS_SUBMIT_SHIPPER_CONTACT_DATA]: saveReceivedInstructionsData,
  [actions.SHIPMENT_INSTRUCTIONS_SUBMIT_NOTIFY_PARTY_DATA]: saveReceivedInstructionsData,
})