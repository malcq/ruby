import { AnyAction } from 'redux';
import * as actions from '../actions/dashboard';

export const fetchDashboardData = ():AnyAction => ({ type: actions.FETCH_DASHBOARD_DATA });

export const fetchDashboardDataSuccess = (payload: IDashboard): AnyAction => ({
  type: actions.FETCH_DASHBOARD_DATA_SUCCESS,
  payload,
});

export const fetchDashboardDataBooking = ():AnyAction => ({ type: actions.FETCH_DASHBOARD_DATA_BOOKING });

export const fetchDashboardDataBookingSuccess = (payload: IShipments): AnyAction => ({
  type: actions.FETCH_DASHBOARD_DATA_BOOKING_SUCCESS,
  payload,
});

export const fetchDashboardDataPrebooked = ():AnyAction => ({ type: actions.FETCH_DASHBOARD_DATA_PREBOOKED });

export const fetchDashboardDataPrebookedSuccess = (payload: IShipments): AnyAction => ({
  type: actions.FETCH_DASHBOARD_DATA_PREBOOKED_SUCCESS,
  payload,
});

export const fetchDashboardDataDelivered = ():AnyAction => ({ type: actions.FETCH_DASHBOARD_DATA_DELIVERED });

export const fetchDashboardDataDeliveredSuccess = (payload: IShipments): AnyAction => ({
  type: actions.FETCH_DASHBOARD_DATA_DELIVERED_SUCCESS,
  payload,
});

export const fetchDashboardDataTransit = ():AnyAction => ({ type: actions.FETCH_DASHBOARD_DATA_TRANSIT });

export const fetchDashboardDataTransitSuccess = (payload: IShipments): AnyAction => ({
  type: actions.FETCH_DASHBOARD_DATA_TRANSIT_SUCCESS,
  payload,
});