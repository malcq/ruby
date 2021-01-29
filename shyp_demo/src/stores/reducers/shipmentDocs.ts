import { createReducer, Reducer } from 'redux-create-reducer';

import * as actions from '../actions/shipmentDocs';
import { AnyAction } from "redux";
import { unionBy, cloneDeep, startCase } from 'lodash';

declare global{
  interface IShipmentDocsState{
    shipmentDocumentsData: any,
    shipmentDocumentTypes: any,
    containerDocumentTypes: any,
    hsCodes: any[],
  }
}

export const initialShipmentDocsState = {
  shipmentDocumentsData: {},
  shipmentDocumentTypes: {},
  containerDocumentTypes: {},
  hsCodes: [],
};

const getShipmentDocumentTypeById = (typeId: string) => {
  const types = {
    'import_duties_vat': 'Import Duties(VAT)',
    'import_declaration': 'Import Declaration',
    'financial_invoice_transportation': 'Financial Invoice Transportation',
    'financial_invoice_duties_vat': 'Financial Invoice Duties(VAT)',
    'manual_quotes': 'Manual Quotes',
    'buying_rates': 'Buying Rates',
    'bill_of_lading': 'Bill Of Lading',
    'draft_bill_of_lading': 'Draft Bill Of Lading',
    'other': 'Other',
    'export_document': 'Export Document',
    'comment_attachments': 'Comment Attachment',
    'uploaded': 'Uploaded',
    'pod': 'POD',
  };

  return types[typeId] != null ? types[typeId] : startCase(typeId);
};

const getContainerDocumentTypeById = (typeId: string) => {
  const types = {
    'commercial_invoice': 'Commercial invoice',
    'packing_list': 'Packing list',
    'commercial_invoice_and_packing_list': 'Comm. Invoice & Packing list',
    'bill_of_lading_draft': 'Bill of Lading (Draft)',
    'bill_of_lading_final': 'Bill of Lading (Final)',
    'atr': 'ATR',
    'certificate_of_origin': 'Certificate of Origin',
    'certificaat_van_oorsprong': 'Certificaat van Oorsprong (CvO)',
    'eur_med_certificaat': 'EUR-MED Certificaat',
    'eur_1_certificaat': 'Eur.1 Certificaat',
    'cim_isv': 'CIM/ISV',
    'dangerous_goods_declaration': 'Dangerous Goods Declaration',
    'msds': 'MSDS',
    'vgm': 'VGM',
    'import_duties': 'Import Duties',
    'import_declaration': 'Import Declaration',
    'loading_list': 'Loading list',
    'hs_code_list': 'HS code list',
    'pro_forma_packing_list': 'Pro Forma Packing List',
    'pro_forma_commercial_invoice': 'Pro Forma Commercial Invoice',
    'inbound_file': 'Inbound file',
  };

  return types[typeId] != null ? types[typeId] : startCase(typeId);
};

const hsCodesSerializer = (hsCodes: any[]) => {
  const hsCodesData: any[] = [];

  if (hsCodes != null ) {
    hsCodes.forEach(parent => {
      hsCodesData.push({
        type: 'parent',
        text: parent.text,
      });

      if (parent.children != null) {
        parent.children.forEach(children => {
          hsCodesData.push({
            type: 'children',
            id: children.id,
            text: children.text,
          });
        })
      }
    });
  }

  return hsCodesData;
};

const receiveShipmentDocuments: Reducer<IShipmentDocsState, AnyAction> = (state, action) => ({
  ...state,
  shipmentDocumentsData: action.payload,
});

const receiveShipmentDocumentTypes: Reducer<IShipmentDocsState, AnyAction> = (state, action) => {
  const shipmentDocumentTypes = action.payload;

  Object.keys(shipmentDocumentTypes)
    .forEach(key => shipmentDocumentTypes[key] = getShipmentDocumentTypeById(key));

  return {
  ...state,
    shipmentDocumentTypes,
  }
};

const receiveContainerDocumentTypes: Reducer<IShipmentDocsState, AnyAction> = (state, action) => {
  const containerDocumentTypes = action.payload;

  Object.keys(containerDocumentTypes)
    .forEach(key => containerDocumentTypes[key] = getContainerDocumentTypeById(key));

  return {
    ...state,
    containerDocumentTypes,
  }
};

const receiveUpdatedShipmentDocument: Reducer<IShipmentDocsState, AnyAction> = (state, action) => {
  const shipmentDocumentsData = cloneDeep(state.shipmentDocumentsData);

  shipmentDocumentsData.shipment_documents.forEach((item, index) => {
    if (item.id === action.payload.id) {
      shipmentDocumentsData.shipment_documents[index] = action.payload;
    }
  });

  return {
    ...state,
    shipmentDocumentsData,
  }
};

const deleteShipmentDocument: Reducer<IShipmentDocsState, AnyAction> = (state, action) => {
  const shipmentDocumentsData = cloneDeep(state.shipmentDocumentsData);

  shipmentDocumentsData.shipment_documents = shipmentDocumentsData.shipment_documents
    .filter(item => item.id !== action.payload.documentId);

  return {
    ...state,
    shipmentDocumentsData,
  }
};

const createShipmentDocument: Reducer<IShipmentDocsState, AnyAction> = (state, action) => {
  const shipmentDocumentsData = cloneDeep(state.shipmentDocumentsData);

  shipmentDocumentsData.shipment_documents.unshift(action.payload);

  return {
    ...state,
    shipmentDocumentsData,
  }
};

const moveShipmentDocument: Reducer<IShipmentDocsState, AnyAction> = (state, action) => {
  const shipmentDocumentsData = cloneDeep(state.shipmentDocumentsData);
  const container = shipmentDocumentsData.containers.find(item => item.id === action.payload.data.container_id);

  shipmentDocumentsData.shipment_documents = shipmentDocumentsData.shipment_documents
    .filter(item => item.id !== action.payload.action.documentId);

  if (container != null) {
    container.container_documents.unshift(action.payload.data)
  }

  return {
    ...state,
    shipmentDocumentsData,
  }
};

const receiveUpdatedContainerDocument: Reducer<IShipmentDocsState, AnyAction> = (state, action) => {
  const shipmentDocumentsData = cloneDeep(state.shipmentDocumentsData);
  const container = shipmentDocumentsData.containers.find(item => item.id === action.payload.container_id);

  if (container != null) {
    container.container_documents.forEach((item, index) => {
      if (item.id === action.payload.id) {
        container.container_documents[index] = action.payload;
      }
    });
  }

  return {
    ...state,
    shipmentDocumentsData,
  }
};

const deleteContainerDocument: Reducer<IShipmentDocsState, AnyAction> = (state, action) => {
  const shipmentDocumentsData = cloneDeep(state.shipmentDocumentsData);
  const container = shipmentDocumentsData.containers.find(item => item.id === action.payload.containerId);

  if (container != null) {
    container.container_documents = container.container_documents.filter(item => item.id !== action.payload.documentId);
  }

  return {
    ...state,
    shipmentDocumentsData,
  }
};

const createContainerDocument: Reducer<IShipmentDocsState, AnyAction> = (state, action) => {
  const shipmentDocumentsData = cloneDeep(state.shipmentDocumentsData);
  const container = shipmentDocumentsData.containers.find(item => item.id === action.payload.container_id);

  if (container != null) {
    container.container_documents.unshift(action.payload)
  }

  return {
    ...state,
    shipmentDocumentsData,
  }
};

const receiveHsCodes: Reducer<IShipmentDocsState, AnyAction> = (state, action) => {
  let hsCodes: any[] = [];

  if (action.payload != null && action.payload.results != null) {
    hsCodes = hsCodesSerializer(action.payload.results)
  }

  return {
    ...state,
    hsCodes,
  }
};

const receiveRelevantHsCodes: Reducer<IShipmentDocsState, AnyAction> = (state, action) => {
  let hsCodes: any[] = [];

  if (action.payload != null && action.payload.results != null) {
    hsCodes = hsCodesSerializer(action.payload.results)
  }

  return {
    ...state,
    hsCodes,
  }
};

const receiveUpdatedContainerHsCodes: Reducer<IShipmentDocsState, AnyAction> = (state, action) => {
  const shipmentDocumentsData = cloneDeep(state.shipmentDocumentsData);
  const container = shipmentDocumentsData.containers.find(item => item.id === action.payload.data.container_id);

  if (container != null) {
    container.hs_codes = action.payload.data.hs_codes;
  }

  return {
    ...state,
    shipmentDocumentsData,
  }
};

const clearHsCodesData: Reducer<IShipmentDocsState, AnyAction> = (state, action) => ({
  ...state,
  hsCodes: [],
});

export default createReducer(initialShipmentDocsState, {
  [actions.SHIPMENT_DOCUMENTS_GET_DATA_SUCCESS]: receiveShipmentDocuments,
  [actions.SHIPMENT_DOCUMENT_TYPES_GET_DATA_SUCCESS]: receiveShipmentDocumentTypes,
  [actions.CONTAINER_DOCUMENT_TYPES_GET_DATA_SUCCESS]: receiveContainerDocumentTypes,
  [actions.SUBMIT_SHIPMENT_DOCUMENT_DATA_SUCCESS]: receiveUpdatedShipmentDocument,
  [actions.DELETE_SHIPMENT_DOCUMENT_SUCCESS]: deleteShipmentDocument,
  [actions.CREATE_SHIPMENT_DOCUMENT_SUCCESS]: createShipmentDocument,
  [actions.MOVE_SHIPMENT_DOCUMENT_SUCCESS]: moveShipmentDocument,
  [actions.SUBMIT_CONTAINER_DOCUMENT_DATA_SUCCESS]: receiveUpdatedContainerDocument,
  [actions.DELETE_CONTAINER_DOCUMENT_SUCCESS]: deleteContainerDocument,
  [actions.CREATE_CONTAINER_DOCUMENT_SUCCESS]: createContainerDocument,
  [actions.HS_CODES_GET_DATA_SUCCESS]: receiveHsCodes,
  [actions.RELEVANT_HS_CODES_GET_DATA_SUCCESS]: receiveRelevantHsCodes,
  [actions.SUBMIT_CONTAINER_HS_CODES_DATA_SUCCESS]: receiveUpdatedContainerHsCodes,
  [actions.CLEAR_HS_CODES_DATA]: clearHsCodesData,
})
