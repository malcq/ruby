import { createReducer, Handlers, Reducer } from 'redux-create-reducer';

import * as actions from '../actions/shipments';
import { AnyAction } from 'redux';

declare global{
  interface IShipmentsState{
    list: IDetailedShipment[];
    filterOptions: IShipmentFilterOptions;
  }

  interface IDetailedShipment{
    barge_precarriage: boolean,
    barge_oncarriage: boolean,
    id: number;
    title: string;
    estimated_departure: string;
    estimated_arrival: string;
    updated_estimated_arrival?: string | null;
    current_estimated_arrival: string;
    status: string;
    type: string;
    token: string;
    token_enabled: boolean;
    carrier_name: string;
    carrier_logo?: string | null;
    reference_number: string;
    documentation_valid: boolean;
    contact_details_valid: boolean;
    valid_information: boolean;
    delayed_days?: string | number | null;
    container_type: string;
    cargo_closing_date: string;
    total_quantity: number;
    show_to_eta: boolean;
    pre_carriage_enabled: boolean;
    pre_carriage_address: string;
    on_carriage_enabled: boolean;
    post_carriage_address: string;
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
    estimated_pickup: string;
    planned_delivery_date?: string | null;
    planned_delivery?: string | null;
    estimated_delivery: string;
    delivery_date_set_by_client: boolean;
    humanized_status: string;
    min_delivery_date: string;
    max_delivery_date: string;
    planned_delivery_time?: number;
    timestamp?: number;
  }

  type ShipmentFilterOption = Array<string | number>;

  interface IShipmentFilterOptions{
    pols: ShipmentFilterOption[];
    pods: ShipmentFilterOption[];
    carriers: ShipmentFilterOption[];
    statuses: ShipmentFilterOption[];
    types: ShipmentFilterOption[];
    // this ones need to be serialized to be compatible with selectors.
    consignees: ShipmentFilterOption[];
    shippers: ShipmentFilterOption[];
    contacts: ShipmentFilterOption[];
    notifyParties: ShipmentFilterOption[];
  }
}

export const initialShipmentsState = {
  list: [],
  count: 0,
  filterOptions: {
    pols: [],
    pods: [],
    carriers: [],
    statuses: [],
    types: [],
    consignees: [],
    shippers: [],
    contacts: [],
    notifyParties: [],
  }
};

const toOption = (line: string) => [ line, line ];

const retrieveShipmentDataWithFilters: Reducer<IShipmentsState, AnyAction> = (state, { payload }) => ({
  ...state,
  list: payload.shipments,
  count: payload.count,
  filterOptions: {
    pols: payload.filtration_data.pols,
    pods: payload.filtration_data.pods,
    carriers: payload.filtration_data.carriers,
    statuses: payload.filtration_data.statuses,
    types: payload.filtration_data.types,
    consignees: payload.filtration_data.consignees.map(toOption),
    shippers: payload.filtration_data.shippers.map(toOption),
    notifyParties: payload.filtration_data.notify_parties.map(toOption),
    contacts: payload.filtration_data.contacts.map(toOption),
  }
});

const retrieveShipmentData: Reducer<IShipmentsState, AnyAction> = (state, { payload }) => ({
  ...state,
  list: payload.shipments,
  count: payload.count,
});


export default createReducer(initialShipmentsState, {
  [actions.SHIPMENTS_GET_DATA_AND_FILTERS_SUCCESS]: retrieveShipmentDataWithFilters,
  [actions.SHIPMENTS_GET_DATA_SUCCESS]: retrieveShipmentData,
})
