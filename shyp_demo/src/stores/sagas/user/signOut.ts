import { AnyAction } from "redux";
import { call } from "redux-saga/effects";

import { LOCAL_STORAGE_CREDENTIAL_KEY } from "../../../config/constants";

export default function * (): Iterator<any> {
  yield call([localStorage, 'removeItem'], LOCAL_STORAGE_CREDENTIAL_KEY)
}