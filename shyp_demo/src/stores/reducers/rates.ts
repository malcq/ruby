import { createReducer, Handlers, Reducer } from 'redux-create-reducer';

import * as actions from '../actions/rates';
import { AnyAction } from "redux";

declare global{
  interface IRequestQuoteParams{
    start_lat: number;
    start_lng: number;
    start: string;
    start_country: string;
    start_zip: string;
    end_lat: string;
    end_lng: string;
    end: string;
    end_country: string;
    end_zip: string;
    quantity: number;
    seafreight_requested: number;
    selected_container_type: number;
    from_rates: number;
  }
  
  interface IRate{
    id: number,
    loading_port: string,
    discharge_port: string,
    validity: string,
    loading_port_thc?: string | null,
    discharge_port_thc?: string | null,
    tt?: number | null,
    seafreight?: string,
    unloading_m3?: string,
    delivery_fee?: string,
    twenty_ft?: string,
    fourty_ft?: string,
    fourty_ft_hc?: string,
    request_quote_params: IRequestQuoteParams,
  }

  interface IRatesState{
    fcl_import: IRate[],
    fcl_export: IRate[],
    lcl_import: IRate[],
    lcl_export: IRate[]
  }
}

export const initialRatesState = {
  fcl_import: [],
  fcl_export: [],
  lcl_import: [],
  lcl_export: []
};

const receiveRates: Reducer<IRatesState, AnyAction> = (state, action) => ({
  ...state,
  ...action.payload,
});


export default createReducer(initialRatesState, {
  [actions.RATES_GET_DATA_SUCCESS]: receiveRates,
})