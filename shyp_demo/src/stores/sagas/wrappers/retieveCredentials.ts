import { call, CallEffect } from 'redux-saga/effects';
import { LOCAL_STORAGE_CREDENTIAL_KEY } from "../../../config/constants"


function* retrieveCredentials(): Iterator<any> {
  const rawCredentials:string = yield call([localStorage, 'getItem'], LOCAL_STORAGE_CREDENTIAL_KEY);
  const credentials = yield call([JSON, 'parse'], rawCredentials);
  return {
    uid: credentials.uid || '',
    accessToken: credentials.accessToken || '',
    clientToken: credentials.clientToken || '',
    impersonator: credentials.impersonator || null,
  }
}

export default ():CallEffect => call(retrieveCredentials)