import { createReducer, Handlers, Reducer } from 'redux-create-reducer';
import { AnyAction } from "redux";
import * as actions from '../actions/searchOverview';

declare global{
  interface ISearchOverview{
    shipment_details: any,
    quote_status: boolean,
    price_details: any,
    loading: boolean,
    is_fastest: string,
    is_cheapest: string,
    predicted_sailing: string,
    containers: any,
  }
}

export const initialSearchQuoteOverviewState: ISearchOverview = {
  shipment_details: {},
  quote_status: false,
  price_details: {},
  loading: true,
  is_fastest: 'false',
  is_cheapest: 'false',
  predicted_sailing: 'false',
  containers: [],
};

const searchQuotes: Reducer<ISearchOverview, AnyAction> = (state, { payload }) => ({
  shipment_details: payload.data.data.shipment_details,
  loading: false,
  quote_status: payload.data.data.quote_status,
  price_details: payload.data.data.price_details,
  is_fastest: payload.data.data.is_fastest,
  is_cheapest: payload.data.data.is_cheapest,
  predicted_sailing: payload.data.data.predicted_sailing,
  containers: payload.data.data.containers,
});

const searchQuotesStart: Reducer<ISearchOverview, AnyAction> = (state, { payload }) => ({
  ...state, loading: true
});


const actionHandlers: Handlers<ISearchOverview> = {
  [actions.SEARCH_QUOTES_OVERVIEW_SUCCESS]: searchQuotes,
  [actions.SEARCH_QUOTES_OVERVIEW]: searchQuotesStart,
};

export default createReducer(initialSearchQuoteOverviewState, actionHandlers);