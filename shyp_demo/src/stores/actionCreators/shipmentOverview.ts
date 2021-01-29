import { AnyAction } from 'redux';
import * as actions from '../actions/shipmentOverview';

export const shipmentOverviewGetData = (id: string): AnyAction => ({
  type: actions.SHIPMENT_OVERVIEW_GET_DATA,
  id,
});

export const shipmentOverviewGetDataSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_OVERVIEW_GET_DATA_SUCCESS,
  payload,
});

export const shipmentOverviewSubmitData = (id: number, payload: any): AnyAction => ({
  type: actions.SUBMIT_SHIPMENT_OVERVIEW_DATA,
  id,
  payload,
});

export const shipmentOverviewSubmitDataSuccess = (payload: any): AnyAction => ({
  type: actions.SUBMIT_SHIPMENT_OVERVIEW_DATA_SUCCESS,
  payload,
});

export const shipmentOverviewUnpinMessage = (shipmentId: number, messageId: number): AnyAction => ({
  type: actions.SHIPMENT_OVERVIEW_UNPIN_MESSAGE,
  shipmentId,
  messageId,
});

export const shipmentOverviewUnpinMessageSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_OVERVIEW_UNPIN_MESSAGE_SUCCESS,
  payload,
});
