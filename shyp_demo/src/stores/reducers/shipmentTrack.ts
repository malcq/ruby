import { createReducer, Reducer } from 'redux-create-reducer';

import * as actions from '../actions/shipmentTrack';
import { AnyAction } from "redux";
import { unionBy } from 'lodash';

declare global{
  interface IShipmentTrack{
    id: number,
    name: string,
  }
  interface IShipmentTrackState{
    list: IShipmentTrack[]
  }
}
export const initialShipmentTrackState = {
  list: [],
};
const receiveList: Reducer<IShipmentTrackState, AnyAction> = (state, action) => ({
  ...state,
  list: action.payload,
});
export default createReducer(initialShipmentTrackState, {
  [actions.SHIPMENT_TRACK_GET_DATA_SUCCESS]: receiveList,
})