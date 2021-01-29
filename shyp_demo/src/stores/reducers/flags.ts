import { createReducer, Handlers, Reducer } from 'redux-create-reducer';
import { LOCATION_CHANGE } from 'react-router-redux';

import * as actions from '../actions/flags';
import { AnyAction } from "redux";
import { FLAGS_NOT_FOUND } from '../actions/flags';

declare global{
  interface IFlagsState{
    notFound: boolean,
  }
}

export const initialFlagsState = {};

const setNotFoundFlag: Reducer<IFlagsState, AnyAction> = (state, action) => ({
  ...state,
  notFound: action.payload,
});

const lowerNotFoundFlag: Reducer<IFlagsState, AnyAction> = (state, action) => ({
  ...state,
  notFound: false,
});


export default createReducer(initialFlagsState, {
  [FLAGS_NOT_FOUND]: setNotFoundFlag,
  [LOCATION_CHANGE]: lowerNotFoundFlag,
})