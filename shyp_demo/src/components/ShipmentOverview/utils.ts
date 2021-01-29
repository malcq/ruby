import moment, { Moment } from 'moment';
import { toLower, includes } from 'lodash';

import { DATE_FORMAT } from '../../config/constants';
import { Logger } from '../../utils/Logger';

export const isFCL = (shipment: IShipmentCarriageData): boolean =>
  includes(['20 ft', '40 ft', '40ft HQ'], shipment.container_type);

type ICarriageType = 'lcl' | 'fcl_barge' | 'fcl_truck' | 'air';

export type IShipmentCarriageData = Pick<IDetailedShipment,
    'estimated_departure'
    | 'estimated_arrival'
    | 'barge_precarriage'
    | 'barge_oncarriage'
    | 'container_type'
    | 'type'
  >

const daysBeforeDeparture = {
  lcl: 7,
  fcl_barge: 7,
  fcl_truck: 5,
  air: 2,
};

const daysBeforeArrival = {
  lcl: 6,
  fcl_barge: 6,
  fcl_truck: 3,
  air: 1,
};

export function toMoment(date: string): Moment | null {
  const result = moment.utc(date, DATE_FORMAT);
  return result.isValid() ? result : null;
}

function getCarriageType (shipment: IShipmentCarriageData, isBarge: boolean): ICarriageType {
  if (toLower(shipment.type) === 'air'){
    return 'air';
  }
  if (isFCL(shipment)) {
    return isBarge ? 'fcl_barge' : 'fcl_truck';
  }
  return 'lcl';
}

const holidays = [5, 6];

export function getWithWorkDayOffset(dateString: string, offset: number): Moment | null{
  const result = toMoment(dateString);
  if (!result) {
    return null;
  }
  const absOffset = Math.abs(offset);
  const increment = offset > 0 ? 1 : -1;
  for (let i=0; i < absOffset; i++) {
    result.add(increment, 'day');
    while(includes(holidays, result.weekday())){
      result.add(increment, 'day')
    }
  }
  return result
}

export const getLatestPrecarriageDate = (shipment: IShipmentCarriageData): Moment | null =>
  getWithWorkDayOffset(
    shipment.estimated_departure,
    - daysBeforeDeparture[getCarriageType(
      shipment,
      shipment.barge_precarriage,
    )]
  );

export const getEarliestOnCarriageDate = (shipment: IShipmentCarriageData): Moment | null =>
  getWithWorkDayOffset(
    shipment.estimated_arrival,
    daysBeforeArrival[getCarriageType(
      shipment,
      shipment.barge_oncarriage
    )],
  );