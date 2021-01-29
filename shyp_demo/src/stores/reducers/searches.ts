import { createReducer, Handlers, Reducer } from 'redux-create-reducer';
import { AnyAction } from "redux";
import * as actions from '../actions/searches';
import moment from "moment";

declare global{
  interface ISearchRoute{
    id: number,
    total_eur: string,
    total_usd: string,
    supplier: string,
    carrier: string,
    tariff_id: number,
    prices_on_request: string,
    containers_count: number,
    estimated_departure: number,
    estimated_arrival: number,
    days_in_freight: number,
    pre_carriage_address: string | null,
    loading_port_code: string,
    loading_port_country: string,
    post_carriage_address: string | null,
    discharge_port_code: string,
    discharge_port_country: string,
    price_details: any,
    shipment_details: any,

  }
  interface ISearch{
    routes: ISearchRoute[] | null,
    loading: boolean,
  }
}

export const initialSearchQuotesState: ISearch = {
  routes: null,
  loading: false,
};

const searchQuotes: Reducer<ISearch, AnyAction> = (state, { payload }) => ({
  routes: payload.data.data && payload.data.data.quotes || [], loading: false
});

const searchQuotesStart: Reducer<ISearch, AnyAction> = (state, { payload }) => ({
  ...state, loading: true
});

const searchQuotesError: Reducer<ISearch, AnyAction> = () => ({
  routes: [], loading: false
});

const searchQuotesReset: Reducer<ISearch, AnyAction> = (state) => ({
  ...state, routes: null
});

const searchQuotesSort: Reducer<ISearch, AnyAction> = (state, { payload }) => {
  switch(payload) {
    case "total_usd":
      return({
        ...state, routes: state.routes && [...state.routes.sort((a, b) => {
          if(parseFloat(a.price_details.total_price_usd) === parseFloat(b.price_details.total_price_usd)) {
            if(+moment(a.shipment_details.estimated_departure).format('X') === +moment(b.shipment_details.estimated_departure).format('X')) {
              return a.shipment_details.estimated_transit_time - b.shipment_details.estimated_transit_time
            }
            return +moment(a.shipment_details.estimated_departure).format('X') - +moment(b.shipment_details.estimated_departure).format('X')
          }
          return parseFloat(a.price_details.total_price_usd) - parseFloat(b.price_details.total_price_usd)
        })]
      });
    case "estimated_transit_time":
      return({
        ...state, routes: state.routes && [...state.routes.sort((a, b) => {
          if(a.shipment_details.estimated_transit_time === b.shipment_details.estimated_transit_time) {
            if(+moment(a.shipment_details.estimated_departure).format('X') === +moment(b.shipment_details.estimated_departure).format('X')) {
              return parseFloat(a.price_details.total_price_usd) - parseFloat(b.price_details.total_price_usd)
            }
            return +moment(a.shipment_details.estimated_departure).format('X') - +moment(b.shipment_details.estimated_departure).format('X')
          }
          return a.shipment_details.estimated_transit_time - b.shipment_details.estimated_transit_time
        })]
      });
    case "estimated_departure":
      return({
        ...state, routes: state.routes && [...state.routes.sort((a, b) => {
          if(+moment(a.shipment_details.estimated_departure).format('X') === +moment(b.shipment_details.estimated_departure).format('X')) {
            if(parseFloat(a.price_details.total_price_usd) === parseFloat(b.price_details.total_price_usd)) {
              return a.shipment_details.estimated_transit_time - b.shipment_details.estimated_transit_time
            }
            return parseFloat(a.price_details.total_price_usd) - parseFloat(b.price_details.total_price_usd)
          }
          return +moment(a.shipment_details.estimated_departure).format('X') - +moment(b.shipment_details.estimated_departure).format('X')
        })]
      });
    default:
      return({...state})
  }
};


const actionHandlers: Handlers<ISearch> = {
  [actions.SEARCH_QUOTES_SUCCESS]: searchQuotes,
  [actions.SEARCH_QUOTES_ERROR]: searchQuotesError,
  [actions.SEARCH_QUOTES]: searchQuotesStart,
  [actions.SEARCH_QUOTES_RESET]: searchQuotesReset,
  [actions.SEARCH_QUOTES_SORT]: searchQuotesSort,
};

export default createReducer(initialSearchQuotesState, actionHandlers);