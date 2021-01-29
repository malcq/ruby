import { AnyAction } from "redux";
import { call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { flashReset } from '../../actionCreators/flash';
import { FLASH_EXPIRATION_INTERVAL } from '../../../config/constants';

export default function * (action: AnyAction): Iterator<any> {
  yield call(delay, FLASH_EXPIRATION_INTERVAL);
  yield put(flashReset());
}