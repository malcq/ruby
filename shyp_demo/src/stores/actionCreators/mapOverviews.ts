import { AnyAction } from 'redux';
import * as actions from '../actions/mapOverviews';

export const mapOverviewsGetData = (): AnyAction => ({ type: actions.MAP_OVERVIEWS_GET_DATA });

export const mapOverviewsGetDataSuccess = (payload: any): AnyAction => ({
    type: actions.MAP_OVERVIEWS_GET_DATA_SUCCESS,
    payload,
});