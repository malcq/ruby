import { AnyAction } from 'redux';
import * as actions from '../actions/shipmentPrice';

export const shipmentPriceGetData = (id: number): AnyAction => ({
  type: actions.SHIPMENT_PRICE_GET_DATA,
  id,
});

export const shipmentPriceGetDataSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_PRICE_GET_DATA_SUCCESS,
  payload,
});