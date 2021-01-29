import { takeEvery } from 'redux-saga/effects';

import * as actions from '../../actions/shipmentTrack';
import * as actionCreators from '../../actionCreators/shipmentTrack';
import { simpleGetAndResolve } from '../factories';

const getTrack = simpleGetAndResolve(
  (action) => `/api/v1/maps/${action.id}`,
  actionCreators.shipmentTrackGetDataSuccess,
  (response) => response.data.data.map_content,
);

export default function * (): Iterator<any> {
  yield takeEvery(actions.SHIPMENT_TRACK_GET_DATA, getTrack);
}