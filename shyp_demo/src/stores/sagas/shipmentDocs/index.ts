import {put, takeEvery} from 'redux-saga/effects';

import * as actions from '../../actions/shipmentDocs';
import * as actionCreators from '../../actionCreators/shipmentDocs';
import {
  simpleGetAndResolve,
  simplePutAndResolve,
  simpleDeleteAndResolve,
  simplePatchAndResolve,
} from '../factories';
import createShipmentDocument from './uploadShipmentDocument';
import createContainerDocument from './uploadContainerDocument';

const getShipmentDocuments = simpleGetAndResolve(
  (action) => `/api/v1/shipments/${action.id}/documents`,
  actionCreators.shipmentDocumentsGetDataSuccess,
  (response) => {
    let responseData = {};

    if (response.data != null) {
      if (response.data.timestamp != null) {
        responseData = {...responseData, timestamp: response.data.timestamp}
      }
      if (response.data.message != null) {
        responseData = {...responseData, message: response.data.message}
      }
      if (response.data.data != null) {
        responseData = {...responseData, ...response.data.data}
      }
    }

    return responseData
  },
);

const getShipmentDocumentTypes = simpleGetAndResolve(
  () => '/api/v1/common/shipment_document_types',
  actionCreators.shipmentDocumentTypesGetDataSuccess,
  (response) => response.data.data.shipment_document_types,
);

const getContainerDocumentTypes = simpleGetAndResolve(
  () => '/api/v1/common/container_document_types',
  actionCreators.containerDocumentTypesGetDataSuccess,
  (response) => response.data.data.container_document_types,
);

const shipmentDocumentSubmitData = simplePutAndResolve(
  (action) => `/api/v1/shipments/${action.shipmentId}/shipment_documents/${action.documentId}`,
  actionCreators.shipmentDocumentSubmitDataSuccess,
  (response) => response.data.data,
);

const deleteShipmentDocument = simpleDeleteAndResolve(
  (action) => `/api/v1/shipments/${action.shipmentId}/shipment_documents/${action.documentId}`,
  actionCreators.deleteShipmentDocumentSuccess,
  (response, action) => action,
);

const moveShipmentDocument = simplePatchAndResolve(
  (action) => `/api/v1/shipments/${action.shipmentId}/shipment_documents/${action.documentId}/move`,
  actionCreators.moveShipmentDocumentSuccess,
  (response, action) => ({ data: response.data.data, action }),
);

const containerDocumentSubmitData = simplePutAndResolve(
  (action) => `/api/v1/containers/${action.containerId}/container_documents/${action.documentId}`,
  actionCreators.containerDocumentSubmitDataSuccess,
  (response) => response.data.data,
);

const deleteContainerDocument = simpleDeleteAndResolve(
  (action) => `/api/v1/containers/${action.containerId}/container_documents/${action.documentId}`,
  actionCreators.deleteContainerDocumentSuccess,
  (response, action) => action,
);

const getHsCodes = simpleGetAndResolve(
  (action) => '/api/v1/common/hs_codes',
  actionCreators.hsCodesGetDataSuccess,
  (response) => response.data,
);

const getRelevantHSCodes = simpleGetAndResolve(
  (action) => `/api/v1/containers/${action.containerId}/relevant_hs_codes`,
  actionCreators.relevantHsCodesGetDataSuccess,
  (response) => response.data,
);

const containerHsCodesSubmitData = simplePatchAndResolve(
  (action) => `/api/v1/containers/${action.containerId}/hs_codes`,
  actionCreators.containerhsCodesSubmitDataSuccess,
  (response) => response.data,
);

export default function * (): Iterator<any> {
  yield takeEvery(actions.SHIPMENT_DOCUMENTS_GET_DATA, getShipmentDocuments);
  yield takeEvery(actions.SHIPMENT_DOCUMENT_TYPES_GET_DATA, getShipmentDocumentTypes);
  yield takeEvery(actions.CONTAINER_DOCUMENT_TYPES_GET_DATA, getContainerDocumentTypes);
  yield takeEvery(actions.SUBMIT_SHIPMENT_DOCUMENT_DATA, shipmentDocumentSubmitData);
  yield takeEvery(actions.DELETE_SHIPMENT_DOCUMENT, deleteShipmentDocument);
  yield takeEvery(actions.CREATE_SHIPMENT_DOCUMENT, createShipmentDocument);
  yield takeEvery(actions.MOVE_SHIPMENT_DOCUMENT, moveShipmentDocument);
  yield takeEvery(actions.SUBMIT_CONTAINER_DOCUMENT_DATA, containerDocumentSubmitData);
  yield takeEvery(actions.DELETE_CONTAINER_DOCUMENT, deleteContainerDocument);
  yield takeEvery(actions.CREATE_CONTAINER_DOCUMENT, createContainerDocument);
  yield takeEvery(actions.HS_CODES_GET_DATA, getHsCodes);
  yield takeEvery(actions.RELEVANT_HS_CODES_GET_DATA, getRelevantHSCodes);
  yield takeEvery(actions.SUBMIT_CONTAINER_HS_CODES_DATA, containerHsCodesSubmitData);
}