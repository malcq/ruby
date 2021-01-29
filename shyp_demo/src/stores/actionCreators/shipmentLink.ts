import { AnyAction } from 'redux';
import * as actions from '../actions/shipmentLink';

export const shipmentLinkGetData = (token: string): AnyAction => ({
  type: actions.SHIPMENT_LINK_GET_DATA,
  id: token,
});

export const shipmentLinkGetDataSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_LINK_GET_DATA_SUCCESS,
  payload,
});