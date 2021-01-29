import { AnyAction } from "redux";
import { call, put } from "redux-saga/effects"
import { replace } from 'react-router-redux';
import { parse } from 'query-string';
import { pick } from 'lodash';

import { retrieveCredentials, storeCredentials } from '../wrappers';
import { requester, Logger } from '../../../utils';
import { userSerializer } from '../../../utils/serializers';
import { userLoadStateSuccess, userLoadStateFailure, flashSuccess } from "../../actionCreators";

interface IImpersonateData extends ICredentials {
  shipmentId?: string,
  blankShipment?: string,
}

function getImpersonateData(location?: any): IImpersonateData | null {
  if (location && location.search) {
    const result = parse(location.search);
    if (result.uid && result['access-token'] && result.client) {
      return {
        uid: result.uid,
        accessToken: result['access-token'],
        clientToken: result.client,
        impersonator: result.impersonator,
        shipmentId: result.shipment_id,
        blankShipment: result.blank_shipment,
      };
    } else {
      return null
    }
  } else {
    return null
  }
}

export default function * (action: AnyAction): Iterator<any> {
  try {
    let credentials: any = {};
    const impersonate = getImpersonateData(action.location);
    if (impersonate) {
      credentials = pick(impersonate, [
        'impersonator', 'accessToken', 'clientToken', 'uid',
      ]);
    } else {
      credentials = yield retrieveCredentials();
    }
    const headers = {
      uid: credentials.uid,
      'access-token': credentials.accessToken,
      client: credentials.clientToken,
    };
    if (credentials.impersonator) {
      headers['request-impersonated-by'] = credentials.impersonator
    }
    const response = yield call([requester, 'request'], {
      headers,
      method: 'GET',
      url: '/api/v1/account',
    });
    const user: IUser = { ...userSerializer(response), ...credentials };
    yield put(userLoadStateSuccess(user));
    if (impersonate) {
      yield storeCredentials(
        credentials.uid,
        credentials.accessToken,
        credentials.clientToken,
        credentials.impersonator
      );
      let redirectPath = '/shipments';
      if (impersonate.shipmentId) {
        redirectPath = `/shipments/${impersonate.shipmentId}`
      } else if (impersonate.blankShipment) {
        redirectPath = '/search';
      }
      yield put(flashSuccess(`You have been logged in as ${user.firstName}, ${user.email}`));
      yield put(replace(redirectPath));
    }
  } catch(error) {
    yield Logger.sagaError(error, 'store::user::loadState');
    yield put(userLoadStateFailure());
  }
}
