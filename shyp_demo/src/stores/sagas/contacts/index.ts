import { takeEvery } from 'redux-saga/effects';

import * as actions from '../../actions/contacts';
import * as actionCreators from '../../actionCreators/contacts';
import {
  simpleGetAndResolve,
  simplePutAndResolve,
  simplePostAndResolve,
  simpleDeleteAndResolve,
} from '../factories';

const getContactsURL = () => 'api/v1/contacts/';
const getOneContactURL = (action) => `api/v1/contacts/${action.id}`;

const getContacts = simpleGetAndResolve(
  getContactsURL,
  actionCreators.contactsGetDataSuccess,
  (response) => response.data.data.contacts,
);

const getOneContact = simpleGetAndResolve(
  getOneContactURL,
  actionCreators.contactsGetOneContactSuccess,
  (response) => response.data.data,
);

const putContact = simplePutAndResolve(
  getOneContactURL,
  actionCreators.contactsPutContactSuccess,
  (response) => response.data.data,
);

const addContact = simplePostAndResolve(
  getContactsURL,
  actionCreators.contactsAddContactSuccess,
  (response) => response.data.data,
);

const deleteContact = simpleDeleteAndResolve(
  getOneContactURL,
  actionCreators.contactsDeleteContactSuccess,
);

export default function* (): Iterator<any> {
  yield takeEvery(actions.CONTACTS_GET_DATA, getContacts);
  yield takeEvery(actions.CONTACTS_GET_ONE_CONTACT, getOneContact);
  yield takeEvery(actions.CONTACTS_PUT_CONTACT, putContact);
  yield takeEvery(actions.CONTACTS_ADD_CONTACT, addContact);
  yield takeEvery(actions.CONTACTS_DELETE_CONTACT, deleteContact);
}