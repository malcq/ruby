import { includes } from 'lodash';
import shipmentInstructions from '../stores/reducers/shipmentInstructions';

export const permissionStatus = {
  full: 'full',
  viewOnly: 'view_only',
  thirdParty: 'third_party',
};

export const resourceKey = {
  shipmentUpdate: 'shipment_update',
  shipmentDocuments: 'shipment_documents',
  shipmentInstructions: 'shipment_instructions',
  shipment: 'shipment',
  hsCodes: 'hs_codes',
  billOfLading: 'bill_of_lading',
};

const defaultPage = /^\/(?:dashboard\/?)?$/;

const publicPages = [
  /^\/login\/?$/,
  /^\/forgot-password\/?$/,
  /^\/public-shipments\/?.*/,
  /^\/change-password\/?$/,
];

export const permissionSettings = {
  [permissionStatus.full]: {
    routeBlackList: [],
    editingForbidden: [],
  },
  [permissionStatus.viewOnly]: {
    routeBlackList: [
      /^\/contacts\/[^/]+?\/edit\/?$/,
      /^\/contacts\/new\/?$/,
    ],
    editingForbidden: [
      resourceKey.shipmentUpdate,
      resourceKey.shipmentDocuments,
      resourceKey.shipmentInstructions,
      resourceKey.shipment,
      resourceKey.hsCodes,
    ]
  },
  [permissionStatus.thirdParty]: {
    routeBlackList: [
      /^\/contacts\/?.*/,
      /^\/rates\/?.*/,
      /^\/map_overviews\/?.*/,
      /^\/search\/?.*/,
      /^\/shipments\/[^/]+?\/instructions\/?.*/,
      /^\/shipments\/[^/]+?\/price-structure\/?.*/,
    ],
    editingForbidden: [
      resourceKey.shipmentInstructions,
      resourceKey.shipmentDocuments,
      resourceKey.shipment,
      resourceKey.hsCodes,
    ]
  }
};

type IMatchTester = (re: RegExp) => boolean;

const makeMatchTester = (route: string): IMatchTester =>
  (regExp: RegExp): boolean => regExp.test(route);

export function isEditingAllowed(resource: string, role: string): boolean {
  if (!permissionSettings[role]){
    return false;
  }
  return !permissionSettings[role].editingForbidden
    || !includes(permissionSettings[role].editingForbidden, resource)
}

export function isRouteAllowed(route: string, role: string): boolean {
  if (
    defaultPage.test(route)
    || publicPages.some(makeMatchTester(route))
  ) {
    return true;
  }

  if (!permissionSettings[role]) {
    return false
  }

  const blackList: RegExp[] | undefined = permissionSettings[role].routeBlackList;

  return !blackList.some(makeMatchTester(route))
}