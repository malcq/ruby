import { createReducer, Handlers, Reducer } from 'redux-create-reducer';

import * as actions from '../actions/quotes';
import { AnyAction } from "redux";
import { QUOTES_GET_DATA_SUCCESS } from '../actions/quotes';

declare global{
  interface IQuote {
    id: number;
    title: string;
    estimated_departure: string;
    estimated_arrival: string;
    updated_estimated_arrival?: string | null;
    current_estimated_arrival: string;
    status: string;
    type: string;
    token: string;
    carrier_name: string;
    carrier_logo?: string | null;
    reference_number?: string | null;
    documentation_valid: boolean;
    contact_details_valid: boolean;
    valid_information: boolean;
    delayed_days?: string | null;
    shipment_type: string;
    total_quantity: number;
    show_to_eta: boolean;
    pre_carriage_enabled: boolean;
    pre_carriage_address?: string | null;
    on_carriage_enabled: boolean;
    post_carriage_address?: string | null;
    loading_port: string;
    loading_port_code: string;
    loading_port_country: string;
    discharge_port: string;
    discharge_port_code: string;
    discharge_port_country: string;
    progress_percent: number;
    pickup_date?: string | null;
    pickup_date_set_by_client: boolean;
    planned_pickup?: string | null;
    estimated_pickup?: string | null;
    planned_delivery_date?: string | null;
    planned_delivery?: string | null;
    estimated_delivery?: string | null;
    delivery_date_set_by_client: boolean;
    created_at: string;
    container_type: string;
    humanized_status: string;
  }

  interface IQuotesState{
    list: IQuote[];
  }
}

export const initialQuotesState = {
  list: [],
};

const receiveList: Reducer<IQuotesState, AnyAction> = (state, action) => ({
  ...state,
  list: action.payload,
});


export default createReducer(initialQuotesState, {
  [QUOTES_GET_DATA_SUCCESS]: receiveList,
})