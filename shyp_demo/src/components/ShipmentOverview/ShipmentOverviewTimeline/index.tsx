import React, { PureComponent, ReactNode } from 'react';
import ReactSVG from 'react-svg';
import classNames from 'classnames/bind';
import PropTypes from "prop-types";
import moment, { Moment } from 'moment';
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import { includes } from 'lodash';

import trackerEdgeDBlue from '../../../assets/images/tracker-edge-dblue.svg';
import trackerCenter from '../../../assets/images/tracker-center.svg';
import { DATE_FORMAT } from '../../../config/constants';

import './styles.scss';
import { getLatestPrecarriageDate, IShipmentCarriageData } from '../utils';


interface IProps {
  type: string;
  progressPercent: number;
  status: string;
  timestamp: number;
  estimatedDeparture: string;
  estimatedArrival: string;
  preCarriageEnabled: boolean;
  onCarriageEnabled: boolean;
  containerType: string;
  isBargePreCarriage: boolean;
  isBargeOnCarriage: boolean;
  isReadOnly: boolean;
  changeBargeCarriage: (field: string, value: boolean) => Promise<any>;
}

interface IState {
  barge_precarriage?: boolean | null;
  barge_oncarriage?: boolean | null;
}

interface ITruckBargeSwitch {
  setTruck(): void,
  setBarge(): void,
  isOptionAvailable(type: 'barge' | 'truck'): boolean,
}

const SHIPMENT_STATUS = {
  initial: 'Initial',
  quote: 'Quote',
  proposed_quote: 'Proposed quote',
  shipment_not_ready: 'Shipment not ready',
  shipper_not_responding: 'Shipper not responding',
  pre_booked: 'Pre booked',
  awaiting_documentation: 'Awaiting documentation',
  booking_confirmed: 'Booking confirmed',
  customs_inbound_on_hold: 'Customs inbound on hold',
  customs_outbound_on_hold: 'Customs outbound on hold',
  cargo_departing_aol: 'Cargo departing aol',
  in_transit_delayed: 'In transit delayed',
  customs_inbound: 'Customs inbound',
  customs_outbound: 'Customs outbound',
  arriving_at_pod: 'Arriving at pod',
  departing_at_pol: 'Departing at pol',
  in_transit_ocean: 'In transit ocean',
  in_transit_air: 'In transit air',
  in_transit_inland_transport: 'In transit inland transport',
  verifying_documentation: 'Verifying documentation',
  documents_verified: 'Documents verified',
  delivered: 'Delivered',
  container_to_shipper: 'Container to shipper',
  container_loading_at_pol: 'Container loading at pol',
  container_at_transshipment_port: 'Container at transshipment port',
  container_discharge_at_pod: 'Container discharge at pod',
  deleted: 'Deleted',
};

const useFirstIfNotNull = (first?: boolean | null, second: boolean = false): boolean =>
  first != null ? first : second;

class ShipmentOverviewTimeline extends PureComponent<IProps, IState> {
  public static propTypes = {
    type: PropTypes.string,
    progressPercent: PropTypes.number,
    status: PropTypes.string,
    timestamp: PropTypes.number,
    estimatedDeparture: PropTypes.string,
    estimatedArrival: PropTypes.string,
    preCarriageEnabled: PropTypes.bool,
    onCarriageEnabled: PropTypes.bool,
    containerType: PropTypes.string,
    changeBargeCarriage: PropTypes.func,
  };

  public static defaultProps = {
    type: '',
    progressPercent: 0,
    status: '',
    timestamp: 0,
    estimatedDeparture: '',
    estimatedArrival: '',
    preCarriageEnabled: false,
    onCarriageEnabled: false,
    containerType: '',
    changeBargeCarriage: null,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      barge_precarriage: null,
      barge_oncarriage: null,
    };
    this.preCarriageSwitch = {
      setBarge: this.setCarriage.bind(this, 'barge_precarriage', true),
      setTruck: this.setCarriage.bind(this, 'barge_precarriage', false),
      isOptionAvailable: this.isPreCarriageOptionAvailable.bind(this),
    };
    this.onCarriageSwitch = {
      setBarge: this.setCarriage.bind(this, 'barge_oncarriage', true),
      setTruck: this.setCarriage.bind(this, 'barge_oncarriage', false),
      isOptionAvailable: this.isOnCarriageOptionAvailable.bind(this)
    };
  }
  
  private preCarriageSwitch: ITruckBargeSwitch;
  private onCarriageSwitch: ITruckBargeSwitch;

  private getShipmentCarriageData(
    shipment: Partial<IShipmentCarriageData>
  ): IShipmentCarriageData{
    return {
      estimated_departure: this.props.estimatedDeparture,
      estimated_arrival: this.props.estimatedArrival,
      type: this.props.type,
      container_type: this.props.containerType,
      barge_precarriage: this.props.isBargePreCarriage,
      barge_oncarriage: this.props.isBargeOnCarriage,
      ...shipment,
    }
  }

  private getCurrentTime(){
    const { timestamp } = this.props;
    return moment.unix(timestamp).utc()
      .set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      })
  }

  private async setCarriage(field: string, isBarge: boolean): Promise<any> {
    const { isReadOnly, changeBargeCarriage } = this.props;
    if (!isReadOnly && changeBargeCarriage && this.state[field] == null) {
      this.setState({ [field]: isBarge });
      await changeBargeCarriage(field, isBarge);
      this.setState({ [field]: null });
    }
  }

  private isPreCarriageOptionAvailable(type: 'barge' | 'truck' = 'barge'): boolean{
    const latest = getLatestPrecarriageDate(this.getShipmentCarriageData({
      barge_precarriage: type === 'barge',
    }));
    return !latest || this.getCurrentTime() < latest;
  }

  private isOnCarriageOptionAvailable(type: 'barge' | 'truck' = 'barge'): boolean{
    return true;
  }

  private renderTransportButton(
    isActive: boolean,
    title: string,
    onClick: ()=>void,
    isFrozen: boolean,
    isVisible: boolean,
    className: string = '',
  ): ReactNode{
    if (isVisible) {
      const { isReadOnly } = this.props;
      return (
        <span
          className={classNames('shipment-overview-timeline__carriage-tooltip-button',
            className, {
              'shipment-overview-timeline__carriage-tooltip-button--active': isActive,
              'shipment-overview-timeline__carriage-tooltip-button--frozen': isFrozen || isReadOnly,
            })}
          onClick={onClick}
        >
          {title}
        </span>
      )
    }
    return null;
  }

  private renderTransportTooltip(
    type: string,
    deadline: Moment,
    switcher: ITruckBargeSwitch,
    isRelevant: boolean,
    isBarge: boolean,
    isFrozen: boolean,
  ): ReactNode {
    const { containerType } = this.props;

    if (!(
        isRelevant
        && deadline
        && this.getCurrentTime() < deadline
        && includes(['20 ft', '40 ft', '40ft HQ'], containerType)
      )) {
      return null
    }

    const isAvailable = {
      truck: switcher.isOptionAvailable('truck'),
      barge: switcher.isOptionAvailable('barge'),
    };

    if (!isAvailable.truck && !isAvailable.barge){
      return null;
    }

    return(
      <div className={`shipment-overview-timeline__${type}`}>
        <Tooltip
          open = {true}
          classes={{
            tooltip: 'shipment-overview-timeline__tooltip mui-override',
            popper: 'shipment-overview-timeline__tooltip-popper mui-override',
          }}
          placement="top"
          title={
            <div className="shipment-overview-timeline__carriage-tooltip-title">
              {this.renderTransportButton(
                !isBarge,
                'Truck',
                switcher.setTruck,
                isFrozen,
                isAvailable.truck,
                'shipment-overview-timeline__carriage-tooltip-button--truck',
              )}
              {this.renderTransportButton(
                isBarge,
                'Barge',
                switcher.setBarge,
                isFrozen,
                isAvailable.barge
              )}
            </div>
          }
        >
          <div className="shipment-overview-timeline__on-carriage-marker"/>
        </Tooltip>
      </div>
    )
  }
  
  public render() {
    const {
      type,
      status,
      estimatedDeparture,
      estimatedArrival,
      onCarriageEnabled,
      preCarriageEnabled,
      isBargePreCarriage,
      isBargeOnCarriage,
    } = this.props;

    const {
      barge_precarriage,
      barge_oncarriage,
    } = this.state;

    const maxPossiblePickupDate = moment
      .utc(estimatedDeparture, DATE_FORMAT)
      .subtract(5, 'day');

    let { progressPercent } = this.props;

    if (progressPercent < 0 || progressPercent > 100) {
      progressPercent = 0;
    }

    const currentTime = this.getCurrentTime();
    const estimatedArrivalTime = moment.utc(estimatedArrival, DATE_FORMAT);
    
    return (
      <div className="shipment-overview-timeline">
        <div className="shipment-overview-timeline__progress-line-container">
          <div className="shipment-overview-timeline__progress-line">
            {this.renderTransportTooltip(
              `pre-carriage${progressPercent < 22 ? '_shifted' : ''}`,
              maxPossiblePickupDate,
              this.preCarriageSwitch,
              preCarriageEnabled,
              useFirstIfNotNull(barge_precarriage, isBargePreCarriage),
              barge_precarriage != null,
            )}
            {this.renderTransportTooltip(
              'on-carriage',
              estimatedArrivalTime,
              this.onCarriageSwitch,
              onCarriageEnabled,
              useFirstIfNotNull(barge_oncarriage, isBargeOnCarriage),
              barge_oncarriage != null,
            )}
            <div style={{ width: `${progressPercent}%` }} className="shipment-overview-timeline__progress-active-line">
              <Tooltip
                open={true}
                classes={{
                  tooltip: 'shipment-overview-timeline__tooltip mui-override',
                  popper: 'shipment-overview-timeline__tooltip-popper mui-override',
                }}
                placement="top"
                title={
                  <span className="shipment-overview-timeline__tooltip-title">
                    <i className="shipment-overview-timeline__tooltip-title-icon icon checkcircle" />
                    {SHIPMENT_STATUS[status]}
                  </span>
                }
              >
                <div className="shipment-overview-timeline__progress-active-line-marker" />
              </Tooltip>
            </div>
            <div className="shipment-overview-timeline__progress-step shipment-overview-timeline__progress-step--start">
              <ReactSVG
                src={trackerEdgeDBlue}
                className={classNames('shipment-overview-timeline__progress-status-background', {
                  'shipment-overview-timeline__progress-status-background--active': progressPercent > 0
                })}
              />
              <i className={classNames('shipment-overview-timeline__progress-status-icon',
                'shipment-overview-timeline__progress-status-icon--start',
                'icon',
                'destination', {
                  'shipment-overview-timeline__progress-status-icon--active': progressPercent > 0
                })}
              />
            </div>
            <div className="shipment-overview-timeline__progress-step shipment-overview-timeline__progress-step--middle-first">
              <ReactSVG
                src={trackerCenter}
                className={classNames('shipment-overview-timeline__progress-status-background', {
                  'shipment-overview-timeline__progress-status-background--active': progressPercent > 30
                })}
              />
              <i className={classNames('shipment-overview-timeline__progress-status-icon',
                'shipment-overview-timeline__progress-status-icon--middle-first',
                'icon', {
                  'container': type === 'sea',
                  'depart': type === 'air',
                  'shipment-overview-timeline__progress-status-icon--active': progressPercent > 30
                })}
              />
            </div>
            <div className="shipment-overview-timeline__progress-step shipment-overview-timeline__progress-step--middle-second">
              <ReactSVG
                src={trackerCenter}
                className={classNames('shipment-overview-timeline__progress-status-background', {
                  'shipment-overview-timeline__progress-status-background--active': progressPercent > 64
                })}
              />
              <i className={classNames('shipment-overview-timeline__progress-status-icon',
                'shipment-overview-timeline__progress-status-icon--middle-first',
                'icon', {
                  'container': type === 'sea',
                  'arrive': type === 'air',
                  'shipment-overview-timeline__progress-status-icon--active': progressPercent > 64
                })}
              />
            </div>
            <div className="shipment-overview-timeline__progress-step shipment-overview-timeline__progress-step--end">
              <ReactSVG
                src={trackerEdgeDBlue}
                className={classNames('shipment-overview-timeline__progress-status-background',
                  'shipment-overview-timeline__progress-status-background--end', {
                  'shipment-overview-timeline__progress-status-background--active': progressPercent > 98
                })}
              />
              <i className={classNames('shipment-overview-timeline__progress-status-icon',
                'shipment-overview-timeline__progress-status-icon--end',
                'icon',
                'destination', {
                  'shipment-overview-timeline__progress-status-icon--active': progressPercent > 98
                })}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShipmentOverviewTimeline