import { includes, get, keys } from 'lodash';
import { ORIGIN_COUNTRY_CODE } from '../../config/constants';

interface IWithSortableOptions {
  options: {
    [x: string]: {
      name: string,
      order: number,
      hidden?: boolean,
    },
  }
}

interface IShipmentGroupProperties extends IWithSortableOptions {
  name: string;
  displayName: string;
  groupBy: (shipment: IDetailedShipment) => string,
  sortRule: ( entry1: any, entry2: any ) => number,
}

interface IShipmentGroupDict{
  [x: string]: IShipmentGroupProperties,
}

const statusGroupMap = [
  ['scheduled', [
    'initial',
    'pre_booked',
    'awaiting_documentation',
    'booking_confirmed',
    'verifying_documentation',
    'documents_verified',
    'shipment_not_ready',
    'shipper_not_responding',
  ]],
  ['inTransit', [
    'customs_inbound_on_hold',
    'customs_outbound_on_hold',
    'in_transit_delayed',
    'cargo_departing_aol',
    'customs_inbound',
    'customs_outbound',
    'arriving_at_pod',
    'departing_at_pol',
    'in_transit_ocean',
    'in_transit_air',
    'in_transit_inland_transport',
    'container_to_shipper',
    'container_loading_at_pol',
    'container_at_transshipment_port',
    'container_discharge_at_pod',
  ]],
  ['delivered', [
    'delivered',
  ]],
];



const makeGroupSortRule = (group: IWithSortableOptions) => (entry1: any, entry2: any): number =>
  get(group.options[get(entry1, 0)], 'order', 0) - get(group.options[get(entry2, 0)], 'order', 0);




const groups = {
  'import': {
    name: 'import',
    displayName: 'Import/Export',
    options: {
      'import': { name: 'Import', order: 0 },
      'export': { name: 'Export', order: 1 },
      'cross_trade': { name: 'Cross-Trade', order: 2 },
    },

    sortRule():boolean { return true },

    groupBy(shipment: IDetailedShipment): string{
      if (shipment.loading_port_country === ORIGIN_COUNTRY_CODE){
        return 'export';
      }
      if (shipment.discharge_port_country === ORIGIN_COUNTRY_CODE){
        return 'import'
      }
      return 'cross_trade';
    },
  },

  'status': {
    name: 'status',
    displayName: 'Status',
    options: {
      inTransit: { name: 'In-Transit shipments', order: 0 },
      scheduled: { name: 'Scheduled / Pre-booked shipments', order: 1 },
      delivered: { name: 'Delivered shipments', order: 2 },
      hidden: { name: '', order: 3 },
    },

    sortRule():boolean { return true },

    groupBy(shipment: IDetailedShipment): string{
      return statusGroupMap.reduce((currentGroupKey: string, [groupKey, statuses]: any[]) =>
        (includes(statuses, shipment.status))
          ? groupKey
          : currentGroupKey,
        'hidden',
      )
    }
  },

  'type': {
    name: 'type',
    displayName: 'Type',
    options: {
      'lcl': { name: 'LCL shipments', order: 0 },
      'fcl': { name: 'FCL shipments', order: 1 },
      'air': { name: 'Air shipments', order: 2 },
    },

    sortRule():boolean { return true },

    groupBy(shipment: IDetailedShipment): string {
      if (shipment.type === 'air') {
        return 'air';
      }
      if (shipment.container_type === 'LCL'){
        return 'lcl';
      }
      return 'fcl';
    },
  },
};

keys(groups).forEach(key => groups[key].sortRule = makeGroupSortRule(groups[key]));

export default groups;