import { createReducer, Reducer } from 'redux-create-reducer';

import * as actions from '../actions';
import { AnyAction } from "redux";

declare global{
  interface IShipmentLayoutCounters{
    documents: number;
    instructions: number;
  }

  interface IShipmentLayoutState{
    layoutData: {
      counters: IShipmentLayoutCounters,
      token: string,
      shipment_title: string,
      status: string,
    },
  }
}
export const initialShipmentLayoutState = {
  layoutData: {
    counters: {
      documents: 0,
      instructions: 0,
    },
    token: '',
    shipment_title: '',
    status: '',
  },
};

const receiveShipmentLayoutData: Reducer<IShipmentLayoutState, AnyAction> = (state, action) => ({
  ...state,
  layoutData: action.payload,
});

const receiveFromOverview: Reducer<IShipmentLayoutState, AnyAction> = (state, action) => ({
  ...state,
  layoutData: {
    ...state.layoutData,
    status: action.payload.status,
    token: action.payload.token,
    shipment_title: action.payload.title,
  },
});

export default createReducer(initialShipmentLayoutState, {
  [actions.SHIPMENT_LAYOUT_GET_DATA_SUCCESS]: receiveShipmentLayoutData,
  [actions.SHIPMENT_LAYOUT_ACCEPT_QUOTE_SUCCESS]: receiveFromOverview,
})
