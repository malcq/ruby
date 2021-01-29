import { takeEvery } from 'redux-saga/effects';

import * as actions from '../../actions/shipments';
import * as actionCreators from '../../actionCreators/shipments';
import { simpleGetAndResolve } from '../factories';
import downloadExcel from './downloadExcel';

const getShipments = simpleGetAndResolve(
  (action) => `/api/v1/shipments/`,
  actionCreators.shipmentsGetDataSuccess,
  (response) => response.data.data,
);

const getShipmentsWithFilters = simpleGetAndResolve(
  (action) => `/api/v1/shipments/`,
  actionCreators.shipmentsGetDataAndFiltersSuccess,
  (response) => response.data.data,
);



export default function * (): Iterator<any> {
  yield takeEvery(actions.SHIPMENTS_GET_DATA, getShipments);
  yield takeEvery(actions.SHIPMENTS_GET_DATA_AND_FILTERS, getShipmentsWithFilters);
  yield takeEvery(actions.SHIPMENTS_DOWNLOAD_EXCEL, downloadExcel)
}