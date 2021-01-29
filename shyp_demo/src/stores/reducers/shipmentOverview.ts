import { createReducer, Reducer } from 'redux-create-reducer';

import * as actions from '../actions';
import { AnyAction } from "redux";
import { unionBy } from 'lodash';

declare global{
  interface IShipmentOverviewState{
    shipmentOverviewData: any,
  }
}

export const initialShipmentOverviewState = {
  shipmentOverviewData: {},
};

const receiveShipmentOverview: Reducer<IShipmentOverviewState, AnyAction> = (state, action) => ({
  ...state,
  shipmentOverviewData: action.payload,
});

const updateMessagesInShipmentOverview: Reducer<IShipmentOverviewState, AnyAction> = (state, action) => {
  const shipmentOverviewData = { ...state.shipmentOverviewData};
  shipmentOverviewData.pinned_messages = shipmentOverviewData.pinned_messages
    .filter(message => message.id !== action.payload.data.comment.id);

  return {
    ...state,
    shipmentOverviewData,
  }
};

export default createReducer(initialShipmentOverviewState, {
  [actions.SHIPMENT_OVERVIEW_GET_DATA_SUCCESS]: receiveShipmentOverview,
  [actions.SUBMIT_SHIPMENT_OVERVIEW_DATA_SUCCESS]: receiveShipmentOverview,
  [actions.SHIPMENT_OVERVIEW_UNPIN_MESSAGE_SUCCESS]: updateMessagesInShipmentOverview,
  [actions.SHIPMENT_LAYOUT_ACCEPT_QUOTE_SUCCESS]: receiveShipmentOverview
})
