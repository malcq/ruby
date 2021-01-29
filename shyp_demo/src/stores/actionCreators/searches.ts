import { AnyAction } from 'redux';
import * as actions from '../actions/searches';

export const searchQuotes = (payload: any): AnyAction => ({
  type: actions.SEARCH_QUOTES,
  payload,
});
export const searchQuotesReset = (): AnyAction => ({
  type: actions.SEARCH_QUOTES_RESET
});

export const searchQuotesSuccess = (payload: any): AnyAction => ({
  type: actions.SEARCH_QUOTES_SUCCESS,
  payload,
});
export const searchQuotesError = (): AnyAction => ({
  type: actions.SEARCH_QUOTES_ERROR,
});
export const searchQuotesSort = (payload: any): AnyAction => ({
  type: actions.SEARCH_QUOTES_SORT,
  payload,
});


