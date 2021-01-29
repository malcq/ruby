import { takeEvery } from 'redux-saga/effects';

import * as actions from '../../actions/mapOverviews';
import * as actionCreators from '../../actionCreators/mapOverviews';
import { simpleGetAndResolve } from '../factories';

const getMaps = simpleGetAndResolve(
  (action) => 'api/v1/maps/',
  actionCreators.mapOverviewsGetDataSuccess,
    (response) => response.data.data.map_content,
);

export default function* (): Iterator<any> {
    yield takeEvery(actions.MAP_OVERVIEWS_GET_DATA, getMaps);

}