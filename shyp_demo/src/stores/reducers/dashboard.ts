import { createReducer, Handlers, Reducer } from 'redux-create-reducer';
import { AnyAction } from "redux";
import * as actions from '../actions/dashboard';

declare global{
  interface IShipment{
    title?: string,
    reference_number?: string,
    estimated_departure?: string,
    loading_port?: string,
    loading_port_country?: string,
    current_estimated_arrival?: string,
    discharge_port?: string,
    discharge_port_country?: string,
    progress_percent?: number,
    valid_information?: boolean,
    delayed_days?: null | number,
    shipment_type?: string,
  }
  interface IShipments{
    shipments: IShipment[],
    loading: boolean,
  }
  interface IDashboard{
    in_transit_count: number,
    not_confirmed_bookings_count: number,
    confirmed_bookings_count: number,
    delivered_count: number,
    in_transit: IShipments,
    not_confirmed_bookings: IShipments,
    confirmed_bookings: IShipments,
    delivered: IShipments,
    loading: boolean,
  }
}

export const initialDashboardState: IDashboard = {
  in_transit_count: 0,
  not_confirmed_bookings_count: 0,
  confirmed_bookings_count: 0,
  delivered_count: 0,
  in_transit: { shipments: [], loading: false },
  not_confirmed_bookings: { shipments: [], loading: false },
  confirmed_bookings: { shipments: [], loading: false },
  delivered: { shipments: [], loading: false },
  loading: false,
};

const saveReceivedDashboardData: Reducer<IDashboard, AnyAction> = (state, { payload }) => ({
  ...state, ...payload, loading: false
});

const saveReceivedDashboardBookingData: Reducer<IDashboard, AnyAction> = (state, { payload }) => ({
  ...state, confirmed_bookings: { shipments: payload.shipments, loading: false }
});

const saveReceivedDashboardPreBookedData: Reducer<IDashboard, AnyAction> = (state, { payload }) => ({
  ...state, not_confirmed_bookings: { shipments: payload.shipments, loading: false }
});

const saveReceivedDashboardDeliveredData: Reducer<IDashboard, AnyAction> = (state, { payload }) => ({
  ...state, delivered: { shipments: payload.shipments, loading: false }
});

const saveReceivedDashboardTransitData: Reducer<IDashboard, AnyAction> = (state, { payload }) => ({
  ...state, in_transit: { shipments: payload.shipments, loading: false }
});

const raiseLoadingFlag: Reducer<IDashboard, AnyAction> = (state, action) => ({
  ...state, loading: true,
});

const raiseLoadingDFlag: Reducer<IDashboard, AnyAction> = (state, action) => ({
  ...state, delivered: { ...state.delivered, loading: true }
});

const raiseLoadingPFlag: Reducer<IDashboard, AnyAction> = (state, action) => ({
  ...state, not_confirmed_bookings: { ...state.not_confirmed_bookings, loading: true }
});

const raiseLoadingTFlag: Reducer<IDashboard, AnyAction> = (state, action) => ({
  ...state, in_transit: { ...state.in_transit, loading: true }
});

const raiseLoadingBFlag: Reducer<IDashboard, AnyAction> = (state, action) => ({
  ...state, confirmed_bookings: { ...state.confirmed_bookings, loading: true }
});

const actionHandlers: Handlers<IDashboard> = {
  [actions.FETCH_DASHBOARD_DATA_SUCCESS]: saveReceivedDashboardData,
  [actions.FETCH_DASHBOARD_DATA_BOOKING_SUCCESS]: saveReceivedDashboardBookingData,
  [actions.FETCH_DASHBOARD_DATA_PREBOOKED_SUCCESS]: saveReceivedDashboardPreBookedData,
  [actions.FETCH_DASHBOARD_DATA_DELIVERED_SUCCESS]: saveReceivedDashboardDeliveredData,
  [actions.FETCH_DASHBOARD_DATA_TRANSIT_SUCCESS]: saveReceivedDashboardTransitData,
  [actions.FETCH_DASHBOARD_DATA]: raiseLoadingFlag,
  [actions.FETCH_DASHBOARD_DATA_BOOKING]: raiseLoadingBFlag,
  [actions.FETCH_DASHBOARD_DATA_PREBOOKED]: raiseLoadingPFlag,
  [actions.FETCH_DASHBOARD_DATA_TRANSIT]: raiseLoadingTFlag,
  [actions.FETCH_DASHBOARD_DATA_DELIVERED]: raiseLoadingDFlag,
};

export default createReducer(initialDashboardState, actionHandlers);