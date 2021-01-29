import * as actions from '../actions/contacts';
import { AnyAction } from 'redux';

export const contactsGetData = (payload?: any): AnyAction => ({
  type: actions.CONTACTS_GET_DATA,
  payload,
});

export const contactsGetDataSuccess = (payload: any): AnyAction => ({
  type: actions.CONTACTS_GET_DATA_SUCCESS,
  payload,
});

export const contactsGetOneContact = (id: any): AnyAction => ({
  type: actions.CONTACTS_GET_ONE_CONTACT,
  id,
});

export const contactsPutContact = (id: number, payload: any): AnyAction => ({
  type: actions.CONTACTS_PUT_CONTACT,
  id,
  payload,
});

export const contactsGetOneContactSuccess = (payload: any): AnyAction => ({
  type: actions.CONTACTS_GET_ONE_CONTACT_SUCCESS,
  payload,
});

export const contactsPutContactSuccess = (payload: any): AnyAction => ({
  type: actions.CONTACTS_PUT_CONTACT_SUCCESS,
  payload,
});

export const contactsAddContact = (payload: any): AnyAction => ({
  type: actions.CONTACTS_ADD_CONTACT,
  payload,
});

export const contactsAddContactSuccess = (payload: any): AnyAction => ({
  type: actions.CONTACTS_ADD_CONTACT_SUCCESS,
  payload,
});

export const contactsDeleteContact = (id: string | number): AnyAction => ({
  type: actions.CONTACTS_DELETE_CONTACT,
  id,
});

export const contactsDeleteContactSuccess = (payload: any): AnyAction => ({
  type: actions.CONTACTS_DELETE_CONTACT_SUCCESS,
  payload,
});

