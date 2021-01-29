import { call, CallEffect } from 'redux-saga/effects';
import { LOCAL_STORAGE_CREDENTIAL_KEY } from "../../../config/constants"

function* storeCredentials(
  uid?: string,
  accessToken?: string,
  clientToken?: string,
  impersonator?: string | null,
): Iterator<any> {
  if(uid && accessToken && clientToken) {
    const value = yield call([JSON, 'stringify'], {
      uid,
      accessToken,
      clientToken,
      impersonator,
    });
    yield call([localStorage, 'setItem'], LOCAL_STORAGE_CREDENTIAL_KEY, value);
  }
}

export default (
  uid?: string,
  accessToken?: string,
  clientToken?: string,
  impersonate?: string | null,
): CallEffect =>
  call(storeCredentials, uid, accessToken, clientToken, impersonate)