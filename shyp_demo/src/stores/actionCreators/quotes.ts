import { AnyAction } from 'redux';
import * as actions from '../actions/quotes';

export const quotesGetData = (): AnyAction => ({ type: actions.QUOTES_GET_DATA });

export const quotesGetDataSuccess = (payload: any): AnyAction => ({
  type: actions.QUOTES_GET_DATA_SUCCESS,
  payload,
});


