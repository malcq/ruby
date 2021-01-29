import { createReducer, Handlers, Reducer } from 'redux-create-reducer';
import { AnyAction } from "redux";
import * as actions from '../actions/searchPrevious';

declare global{
  interface ISearchPreviousRoute{
    id: number,
    container_type: string,
    departure_date: number,
    results_count: number,
    origin: string,
    start_lat: string,
    start_lng: string,
    start_zip: string | null,
    start_country: string,
    destination: string,
    end_lat: string,
    end_lng: string,
    end_zip: string | null,
    end_country: string,
    shipments_quantity: string,
    lengths: string[] | null,
    heights: string[] | null,
    widths: string[] | null,
    weights: string[] | null,
    start_include_nearby: string | null,
    end_include_nearby: string | null,
    on_carriage: string | null,
    pre_carriage: string | null,
    import_custom_formalities: string | null,
    export_custom_formalities: string | null,
    seafreight_requested: string | null,
    origin_port_charges: string | null,
    destination_port_charges: string | null,
    insurance: string | null
  }
  interface ISearchPrevious{
    routes: ISearchPreviousRoute[] | null,
    loading: boolean,
  }
}

export const initialSearchPreviousState: ISearchPrevious = {
  routes: null,
  loading: false,
};

const searchPrevious: Reducer<ISearchPrevious, AnyAction> = (state, { payload }) => ({
  routes: payload.data.data.searches, loading: false
});

const searchPreviousStart: Reducer<ISearchPrevious, AnyAction> = (state, { payload }) => ({
  ...state, loading: true
});


const actionHandlers: Handlers<ISearchPrevious> = {
  [actions.SEARCH_PREVIOUS_SUCCESS]: searchPrevious,
  [actions.SEARCH_PREVIOUS]: searchPreviousStart,
};

export default createReducer(initialSearchPreviousState, actionHandlers);