import { takeEvery } from "redux-saga/effects"

import * as actions from '../../actions/dashboard';
import * as actionCreators from '../../actionCreators/dashboard';
import { simpleGetAndResolve } from '../factories';

const getDashboardBooking = simpleGetAndResolve(
  () => '/api/v1/dashboard',
  actionCreators.fetchDashboardDataSuccess,
  (response) => response.data.data
);

const getDashboardBookingData = simpleGetAndResolve(
  () => '/api/v1/dashboard/detailed_shipments?shipment_type=confirmed_bookings ',
  actionCreators.fetchDashboardDataBookingSuccess,
  (response) => response.data.data
);

const getDashboardPreBookedData = simpleGetAndResolve(
  () => '/api/v1/dashboard/detailed_shipments?shipment_type=not_confirmed_bookings ',
  actionCreators.fetchDashboardDataPrebookedSuccess,
  (response) => response.data.data
);

const getDashboardTransitData = simpleGetAndResolve(
  () => '/api/v1/dashboard/detailed_shipments?shipment_type=in_transit ',
  actionCreators.fetchDashboardDataTransitSuccess,
  (response) => response.data.data
);

const getDashboardDeliveredData = simpleGetAndResolve(
  () => '/api/v1/dashboard/detailed_shipments?shipment_type=delivered ',
  actionCreators.fetchDashboardDataDeliveredSuccess,
  (response) => response.data.data
);

export default function * (): Iterator<any> {
  yield takeEvery(actions.FETCH_DASHBOARD_DATA, getDashboardBooking);
  yield takeEvery(actions.FETCH_DASHBOARD_DATA_BOOKING, getDashboardBookingData);
  yield takeEvery(actions.FETCH_DASHBOARD_DATA_PREBOOKED, getDashboardPreBookedData);
  yield takeEvery(actions.FETCH_DASHBOARD_DATA_TRANSIT, getDashboardTransitData);
  yield takeEvery(actions.FETCH_DASHBOARD_DATA_DELIVERED, getDashboardDeliveredData);
}