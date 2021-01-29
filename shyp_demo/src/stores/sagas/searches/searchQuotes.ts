import { ActionCreator,AnyAction } from "redux";

import { authorizedRequest } from '../wrappers';
import { Logger } from '../../../utils';
import * as actionCreators from '../../actionCreators/searches';
import {flashError} from '../../actionCreators';
import {put} from "redux-saga/effects";

export default function * (action: AnyAction): Iterator<any> {
  try {
    const params: any = {};
    if (action.payload.origin) {
      params.start = action.payload.origin.value;
      params.start_lat = action.payload.origin.lat;
      params.start_lng = action.payload.origin.lng;
      if (action.payload.origin.zip) {
        params.start_zip = action.payload.origin.zip;
      }
      if (action.payload.origin.country) {
        params.start_country = action.payload.origin.country;
      }
      if (action.payload.origin.incl_nearby) {
        params.start_include_nearby = 1;
      }
    }
    if (action.payload.destination) {
      params.end = action.payload.destination.value;
      params.end_lat = action.payload.destination.lat;
      params.end_lng = action.payload.destination.lng;
      if (action.payload.destination.zip) {
        params.end_zip = action.payload.destination.zip;
      }
      if (action.payload.destination.country) {
        params.end_country = action.payload.destination.country;
      }
      if (action.payload.destination.incl_nearby) {
        params.end_include_nearby = 1;
      }
    }
    switch (action.payload.selectedType) {
      case 'multiple':
        params.selected_container_type = '20';
        params.quantity = 1;
        break;
      case 'container20ft':
        params.selected_container_type = '20';
        params.quantity = action.payload.selectedCount;
        break;
      case 'container40ft':
        params.selected_container_type = '40';
        params.quantity = action.payload.selectedCount;
        break;
      case 'container40fthq':
        params.selected_container_type = '40hq';
        params.quantity = action.payload.selectedCount;
        break;
      case 'lcl':
        params.selected_container_type = 'lcl';
        params.heights = action.payload.lcl.map(item => (item.height));
        params.lengths = action.payload.lcl.map(item => (item.length));
        params.widths = action.payload.lcl.map(item => (item.width));
        params.weights = action.payload.lcl.map(item => (item.weight));
        params.quantities = action.payload.lcl.map(item => (item.total));
        break;
      case 'air':
        params.selected_container_type = 'air';
        params.heights = action.payload.lcl.map(item => (item.height));
        params.lengths = action.payload.lcl.map(item => (item.length));
        params.widths = action.payload.lcl.map(item => (item.width));
        params.weights = action.payload.lcl.map(item => (item.weight));
        params.quantities = action.payload.lcl.map(item => (item.total));
        break;
    }
    // params.departure_date = action.payload.departure_date.format('X');
    params.departure_date = action.payload.departure_date.format('DD-MM-YYYY');
    // params.departure_date = 1538168400;
    if (action.payload.services.pre_carriage) {
      params.pre_carriage = 1;
    }
    if (action.payload.services.origin_port_charges) {
      params.origin_port_charges = 1;
    }
    if (action.payload.services.export_custom_formalities) {
      params.export_custom_formalities = 1;
    }
    if (action.payload.services.seafreight_requested) {
      params.seafreight_requested = 1;
    }
    if (action.payload.services.import_custom_formalities) {
      params.import_custom_formalities = 1;
    }
    if (action.payload.services.destination_port_charges) {
      params.destination_port_charges = 1;
    }
    if (action.payload.services.on_carriage) {
      params.on_carriage = 1;
    }
    if (action.payload.services.insurance) {
      params.insurance = 1;
      params.cif_value = action.payload.cif_value;
    }
    const response = yield authorizedRequest({
      method: 'GET',
      url: 'api/v1/request_quotes/search',
      params,
    });
    yield put(actionCreators.searchQuotesSuccess(response))
  } catch(error) {
    if (error.message === 'Network Error') {
      yield put(flashError('Something went wrong. Please try again. When the issue persists, please contact us on +31 85 066 0000.', 10000));
    }else {
      if(error.response.data.message.includes('can not be equal')){
        yield put(flashError("Port of Loading cannot be Port of Discharge. Please change on of them.", 4000))
      }else {
        yield put(flashError(error.response.data.message, 4000))
      }
    }
    yield put(actionCreators.searchQuotesError())
    yield Logger.sagaError(error, 'store::user::loadState');
  }
}