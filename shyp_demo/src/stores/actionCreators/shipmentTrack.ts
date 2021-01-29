import { AnyAction } from 'redux';
import * as actions from '../actions/shipmentTrack';

export const shipmentTrackGetData = (id: number): AnyAction => ({
  type: actions.SHIPMENT_TRACK_GET_DATA,
  id,
});

export const shipmentTrackGetDataSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_TRACK_GET_DATA_SUCCESS,
  payload,
});