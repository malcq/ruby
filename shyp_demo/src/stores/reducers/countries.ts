import { createReducer, Handlers, Reducer } from 'redux-create-reducer';

import * as actions from '../actions/countries';
import { AnyAction } from "redux";

declare global{
  type ICountry = string[]

  interface ICountriesState {
    list: ICountry[]
  }
}

export const initialCountriesState: ICountriesState = {
  list: []
};

export default createReducer(initialCountriesState, {
  [actions.COUNTRIES_GET_COUNTRIES_SUCCESS]: (state: ICountriesState, action: AnyAction) => ({ state, list: action.payload }),
})