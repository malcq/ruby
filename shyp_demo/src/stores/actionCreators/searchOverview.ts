import { AnyAction } from 'redux';
import * as actions from '../actions/searchOverview';

export const searchQuotesOverview = (payload: any): AnyAction => ({
  type: actions.SEARCH_QUOTES_OVERVIEW,
  payload,
});

export const searchQuotesOverviewSuccess = (payload: any): AnyAction => ({
  type: actions.SEARCH_QUOTES_OVERVIEW_SUCCESS,
  payload,
});


