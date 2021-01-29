import { AnyAction } from 'redux';
import * as actions from '../actions/shipmentDocs';

export const shipmentDocumentsGetData = (id: string): AnyAction => ({
  type: actions.SHIPMENT_DOCUMENTS_GET_DATA,
  id,
});

export const shipmentDocumentsGetDataSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_DOCUMENTS_GET_DATA_SUCCESS,
  payload,
});

export const shipmentDocumentTypesGetData = (): AnyAction => ({
  type: actions.SHIPMENT_DOCUMENT_TYPES_GET_DATA,
});

export const shipmentDocumentTypesGetDataSuccess = (payload: any): AnyAction => ({
  type: actions.SHIPMENT_DOCUMENT_TYPES_GET_DATA_SUCCESS,
  payload,
});

export const containerDocumentTypesGetData = (): AnyAction => ({
  type: actions.CONTAINER_DOCUMENT_TYPES_GET_DATA,
});

export const containerDocumentTypesGetDataSuccess = (payload: any): AnyAction => ({
  type: actions.CONTAINER_DOCUMENT_TYPES_GET_DATA_SUCCESS,
  payload,
});

export const shipmentDocumentSubmitData = (shipmentId: number, documentId: number, payload: any): AnyAction => ({
  type: actions.SUBMIT_SHIPMENT_DOCUMENT_DATA,
  shipmentId,
  documentId,
  payload,
});

export const shipmentDocumentSubmitDataSuccess = (payload: any): AnyAction => ({
  type: actions.SUBMIT_SHIPMENT_DOCUMENT_DATA_SUCCESS,
  payload,
});

export const deleteShipmentDocument = (shipmentId: number, documentId: number, payload: any): AnyAction => ({
  type: actions.DELETE_SHIPMENT_DOCUMENT,
  shipmentId,
  documentId,
  payload,
});

export const deleteShipmentDocumentSuccess = (payload: any): AnyAction => ({
  type: actions.DELETE_SHIPMENT_DOCUMENT_SUCCESS,
  payload,
});

export const createShipmentDocument = (shipmentId: number, payload: any): AnyAction => ({
  type: actions.CREATE_SHIPMENT_DOCUMENT,
  shipmentId,
  payload,
});

export const createShipmentDocumentSuccess = (payload: any): AnyAction => ({
  type: actions.CREATE_SHIPMENT_DOCUMENT_SUCCESS,
  payload,
});

export const moveShipmentDocument = (shipmentId: number, documentId: number, payload: any): AnyAction => ({
  type: actions.MOVE_SHIPMENT_DOCUMENT,
  shipmentId,
  documentId,
  payload,
});

export const moveShipmentDocumentSuccess = (payload: any): AnyAction => ({
  type: actions.MOVE_SHIPMENT_DOCUMENT_SUCCESS,
  payload,
});

export const containerDocumentSubmitData = (containerId: number, documentId: number, payload: any): AnyAction => ({
  type: actions.SUBMIT_CONTAINER_DOCUMENT_DATA,
  containerId,
  documentId,
  payload,
});

export const containerDocumentSubmitDataSuccess = (payload: any): AnyAction => ({
  type: actions.SUBMIT_CONTAINER_DOCUMENT_DATA_SUCCESS,
  payload,
});

export const deleteContainerDocument = (containerId: number, documentId: number, payload: any): AnyAction => ({
  type: actions.DELETE_CONTAINER_DOCUMENT,
  containerId,
  documentId,
  payload,
});

export const deleteContainerDocumentSuccess = (payload: any): AnyAction => ({
  type: actions.DELETE_CONTAINER_DOCUMENT_SUCCESS,
  payload,
});

export const createContainerDocument = (containerId: number, payload: any): AnyAction => ({
  type: actions.CREATE_CONTAINER_DOCUMENT,
  containerId,
  payload,
});

export const createContainerDocumentSuccess = (payload: any): AnyAction => ({
  type: actions.CREATE_CONTAINER_DOCUMENT_SUCCESS,
  payload,
});

export const hsCodesGetData = (payload: string): AnyAction => ({
  type: actions.HS_CODES_GET_DATA,
  payload,
});

export const hsCodesGetDataSuccess = (payload: any): AnyAction => ({
  type: actions.HS_CODES_GET_DATA_SUCCESS,
  payload,
});

export const relevantHsCodesGetData = (containerId: number, payload: any): AnyAction => ({
  type: actions.RELEVANT_HS_CODES_GET_DATA,
  containerId,
  payload
});

export const relevantHsCodesGetDataSuccess = (payload: any): AnyAction => ({
  type: actions.RELEVANT_HS_CODES_GET_DATA_SUCCESS,
  payload,
});

export const containerHsCodesSubmitData = (containerId: number, payload: any): AnyAction => ({
  type: actions.SUBMIT_CONTAINER_HS_CODES_DATA,
  containerId,
  payload,
});

export const containerhsCodesSubmitDataSuccess = (payload: any): AnyAction => ({
  type: actions.SUBMIT_CONTAINER_HS_CODES_DATA_SUCCESS,
  payload,
});

export const clearHsCodesData = (): AnyAction => ({
  type: actions.CLEAR_HS_CODES_DATA,
});