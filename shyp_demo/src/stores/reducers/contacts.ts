import { createReducer, Handlers, Reducer } from 'redux-create-reducer';
import { unionBy } from 'lodash';

import * as actions from '../actions/contacts';
import { AnyAction } from "redux";

declare global{
  interface IContactsState{
    list: IContact[];
  }
  interface IContact{
    id: number;
    contact_type: string;
    name: string;
    address?: string | null;
    postal_code?: string | null;
    city?: string | null;
    country?: string | null;
    vat_number?: string | null;
    eori_number?: string | null;
    email?: string;
    phone: string;
    company_id?: number | null;
  }
}

export const initialContactsState = {
  list: [],
};

const receiveList: Reducer<IContactsState, AnyAction> = (state, action) => ({
  ...state,
  list: action.payload,
});

const receiveOne: Reducer<IContactsState, AnyAction> = (state, action) => ({
  ...state,
  list: unionBy([action.payload], state.list, 'id')
});


export default createReducer(initialContactsState, {
  [actions.CONTACTS_GET_DATA_SUCCESS]: receiveList,
  [actions.CONTACTS_GET_ONE_CONTACT_SUCCESS]: receiveOne,
  [actions.CONTACTS_PUT_CONTACT_SUCCESS]: receiveOne,
  [actions.CONTACTS_ADD_CONTACT_SUCCESS]: receiveOne,
})