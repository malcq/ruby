import { createReducer, Reducer } from 'redux-create-reducer';

import * as actions from '../actions/shipmentLink';
import { AnyAction } from "redux";
import { unionBy } from 'lodash';

declare global{
  interface IShipmentLink{
    id: number,
    token: string,
  }
  interface IShipmentLinkState{
    public_shipment: IShipmentLink[],
    markers: any,
  }
}
export const initialShipmentLinkState = {
  public_shipment: {},
  markers: [],
};
const receiveList: Reducer<IShipmentLinkState, AnyAction> = (state, action) => ({
  ...state,
  markers: action.payload.map_content,
  public_shipment: action.payload.public_shipment,
});
export default createReducer(initialShipmentLinkState, {
  [actions.SHIPMENT_LINK_GET_DATA_SUCCESS]: receiveList,
})