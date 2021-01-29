import { call, select, CallEffect } from 'redux-saga/effects';

import { credentialsSelector } from './';
import { requester } from '../../../utils/';

interface IRequestData {
  responseType?: string,
  headers?: any;
  method: string;
  url: string;
  data?: any;
  params?: any;
}



function* authorizedRequest (requestData: IRequestData): Iterator<any>{
  const creds = yield select(credentialsSelector);
  const requestOptions = {
    ...requestData,
    headers: {
      ...requestData.headers,
      uid: creds.uid,
      client: creds.clientToken,
      'access-token': creds.accessToken,
    },
  };
  if (creds.impersonator) {
    requestOptions.headers['request-impersonated-by'] = creds.impersonator;
  }
  return yield call([requester, 'request'], requestOptions);
}

export default (requestData: IRequestData): CallEffect => call(authorizedRequest, requestData);
