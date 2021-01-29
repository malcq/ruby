import { AnyAction } from 'redux';
import * as actions from '../actions/shipmentInstructions';

export const shipmentInstructionsGetData = (id: number): AnyAction => ({
  type: actions.SHIPMENT_INSTRUCTIONS_GET_DATA,
  id,
});

export const shipmentInstructionsGetDataSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_INSTRUCTIONS_GET_DATA_SUCCESS,
  payload,
});

export const shipmentInstructionsSubmitConsigneeCompanyData = (payload: any, id: number): AnyAction => ({
  type: actions.SHIPMENT_INSTRUCTIONS_SUBMIT_CONSIGNEE_DATA,
  payload,
  id,
});

export const shipmentInstructionsSubmitConsigneeContactData = (payload: any, id: number): AnyAction => ({
  type: actions.SHIPMENT_INSTRUCTIONS_SUBMIT_CONSIGNEE_CONTACT_DATA,
  payload,
  id,
});

export const shipmentInstructionsSubmitShipperCompanyData = (payload: any, id: number): AnyAction => ({
  type: actions.SHIPMENT_INSTRUCTIONS_SUBMIT_SHIPPER_DATA,
  payload,
  id,
});

export const shipmentInstructionsSubmitShipperContactData = (payload: any, id: number): AnyAction => ({
  type: actions.SHIPMENT_INSTRUCTIONS_SUBMIT_SHIPPER_CONTACT_DATA,
  payload,
  id,
});

export const shipmentInstructionsSubmitNotifyPartyData = (payload: any, id: number): AnyAction => ({
  type: actions.SHIPMENT_INSTRUCTIONS_SUBMIT_NOTIFY_PARTY_DATA,
  payload,
  id,
});

export const shipmentInstructionsPutDataSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_INSTRUCTIONS_UPDATE_DATA,
  payload,
});