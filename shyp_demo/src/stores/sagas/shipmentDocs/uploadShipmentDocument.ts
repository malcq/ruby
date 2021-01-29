import { call, put } from 'redux-saga/effects';

import { retrieveCredentials, resolveAction, rejectAction } from '../wrappers';
import { Logger } from "../../../utils";
import { authorizedRequest } from '../wrappers';
import * as actionCreators from "../../actionCreators";

export default function * (action: IPromisifiedAction): Iterator<any> {
  const { shipmentId, payload } = action;

  try{
    const credentials: ICredentials = yield retrieveCredentials();
    const formData = new FormData();
    formData.append('file', payload.file);
    const response = yield authorizedRequest({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      url: `/api/v1/shipments/${shipmentId}/shipment_documents`,
      data: formData,
    });
    yield put(actionCreators.createShipmentDocumentSuccess(response.data.data));
    yield resolveAction(action);
  } catch(error) {
    yield Logger.sagaError(error, 'store::user::getUserData');
    yield rejectAction(action, error);
  }
}