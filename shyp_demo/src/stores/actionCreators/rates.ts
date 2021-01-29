import { AnyAction } from 'redux';
import * as actions from '../actions/rates';

export const ratesGetData = (payload: any): AnyAction => ({
  type: actions.RATES_GET_DATA,
  payload,
});

export const ratesGetDataSuccess = (payload: any): AnyAction => ({
  type: actions.RATES_GET_DATA_SUCCESS,
  payload,
});
