import { createReducer, Reducer } from 'redux-create-reducer';

import * as actions from '../actions/companies';
import { AnyAction } from "redux";

declare global {
  interface ICompaniesState {
    list: ICompany[]
  }

  type ICompany = string[]
}

export const initialCompaniesState = {
  list: [],
};

const receiveList: Reducer<ICompaniesState, AnyAction> = (state, action) => ({
  ...state, list: action.payload,
});

export default createReducer(initialCompaniesState, {
  [actions.COMPANIES_GET_DATA_SUCCESS]: receiveList,
})