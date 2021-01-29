import { AnyAction } from 'redux';
import * as actions from '../actions/shipments';


/*
 @param payload : carries query-params of the GET request for shipments and filters
*/
export const shipmentsGetData = (payload?: any): AnyAction => ({
  type: actions.SHIPMENTS_GET_DATA,
  payload,
});

/* @param payload : {
 shipments: list of shipments,
 filter_options: object with various filter options
}*/
export const shipmentsGetDataSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENTS_GET_DATA_SUCCESS,
  payload,
});

/*
 @param payload : carries query-params of the GET request for shipments and filters
*/
export const shipmentsGetDataAndFilters = (payload?: any): AnyAction => ({
  type: actions.SHIPMENTS_GET_DATA_AND_FILTERS,
  payload,
});

/* @param payload : {
 shipments: list of shipments,
 filter_options: object with various filter options
}*/
export const shipmentsGetDataAndFiltersSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENTS_GET_DATA_AND_FILTERS_SUCCESS,
  payload,
});

export const shipmentsDownloadExcel = (payload: any): AnyAction => ({
  type: actions.SHIPMENTS_DOWNLOAD_EXCEL,
  payload,
});

