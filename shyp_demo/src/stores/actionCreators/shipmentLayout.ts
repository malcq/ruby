import { AnyAction } from 'redux';
import * as actions from '../actions/shipmentLayout';

export const shipmentLayoutGetData = (id: number): AnyAction => ({
  type: actions.SHIPMENT_LAYOUT_GET_DATA,
  id,
});

export const shipmentLayoutGetDataSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_LAYOUT_GET_DATA_SUCCESS,
  payload,
});

export const shipmentLayoutDeleteShipment = (id: number): AnyAction => ({
  type: actions.SHIPMENT_LAYOUT_DELETE_SHIPMENT,
  id,
});

export const shipmentLayoutDeleteShipmentSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_LAYOUT_DELETE_SHIPMENT_SUCCESS,
  payload,
});


export const shipmentLayoutAcceptQuote = (id: number): AnyAction => ({
  type: actions.SHIPMENT_LAYOUT_ACCEPT_QUOTE,
  id,
});

export const shipmentLayoutAcceptQuoteSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_LAYOUT_ACCEPT_QUOTE_SUCCESS,
  payload,
});
