import { AnyAction } from 'redux';
import * as actions from '../actions/searchPrevious';

export const searchPrevious = (payload: any): AnyAction => ({
  type: actions.SEARCH_PREVIOUS,
  payload,
});

export const searchPreviousSuccess = (payload: any): AnyAction => ({
  type: actions.SEARCH_PREVIOUS_SUCCESS,
  payload,
});


