import { takeEvery } from 'redux-saga/effects';
import closeTimer from './closeTimer';

import * as actions from '../../actions';

export default function* (): Iterator<any> {
  yield takeEvery(actions.CONTACTS_PUT_CONTACT_SUCCESS, closeTimer);
}