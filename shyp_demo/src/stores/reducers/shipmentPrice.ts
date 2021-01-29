import { createReducer, Reducer } from 'redux-create-reducer';

import * as actions from '../actions/shipmentPrice';
import { AnyAction } from "redux";
import { unionBy } from 'lodash';

declare global{
  interface IShipmentPrice{
    services: [],
  }
  interface IShipmentPriceState{
    data: IShipmentPrice,
  }
}
export const initialShipmentPriceState = {
  data: {services: []},
};
const receiveList: Reducer<IShipmentPriceState, AnyAction> = (state, action) => ({
  ...state,
  data: action.payload,
});
export default createReducer(initialShipmentPriceState, {
  [actions.SHIPMENT_PRICE_GET_DATA_SUCCESS]: receiveList,
})