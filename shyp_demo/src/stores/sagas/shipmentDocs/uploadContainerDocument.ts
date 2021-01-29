import { call, put } from 'redux-saga/effects';

import { retrieveCredentials, resolveAction, rejectAction } from '../wrappers';
import { Logger } from "../../../utils";
import { authorizedRequest } from '../wrappers';
import * as actionCreators from "../../actionCreators";

export default function * (action: IPromisifiedAction): Iterator<any> {
  const { containerId, payload } = action;

  try{
    const formData = new FormData();
    formData.append('file', payload.file);
    const response = yield authorizedRequest({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      url: `/api/v1/containers/${containerId}/container_documents`,
      data: formData,
    });
    yield put(actionCreators.createContainerDocumentSuccess(response.data.data));
    yield resolveAction(action);
  } catch(error) {
    yield Logger.sagaError(error, 'store::user::getUserData');
    yield rejectAction(action, error);
  }
}