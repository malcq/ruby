import React, { PureComponent, ReactNode } from 'react';
import PropTypes, { node } from 'prop-types';
import { Link } from 'react-router-dom';
import { includes } from 'lodash';
import moment from 'moment'

import { DATE_FORMAT } from '../../config/constants';
import { Button } from '../';
import { shipmentGroups } from '../../pages/';
import './styles.scss';

interface IShipmentProps {
  data?: IDetailedShipment,
  displayStatus?: string | null,
  publicShipment?: boolean,
}

const thresholds = {
  precarriage: 10,
  departure: 33,
  arrival: 66,
  delivery: 99,
};

const formatDate = (dateString) => (dateString)
  ? moment(dateString, DATE_FORMAT).format('DD MMM YYYY')
  : 'Not available';

const getDateDiff = (firstDate: string, secondDate: string): number =>
  +moment.duration(moment(firstDate, DATE_FORMAT).diff(moment(secondDate, DATE_FORMAT)));

function getToETA(eta: string): string{
  const duration = moment.duration(moment(eta, DATE_FORMAT).diff(moment())).days();
  return `${duration > 0 ? duration : 0} days to ETA`
};

class Shipment extends PureComponent<IShipmentProps> {
  public static propTypes = {
    data: PropTypes.any,
    publicShipment: PropTypes.any,
    toLocation: PropTypes.func,
  };
  public static defaultProps = {
    publicShipment: false,
    toLocation(){}
  };
  public render () {
    if (this.props.data == null) {
      return null
    }

    const {
      id,
      reference_number,
      title,
      type,
      estimated_arrival,
      updated_estimated_arrival,
      documentation_valid,
      show_to_eta,
      delayed_days,
      carrier_name,
      carrier_logo,
      total_quantity,
      container_type,
      status,
      humanized_status,
      pre_carriage_enabled,
    } = this.props.data;

    let progress_percent = this.props.data.progress_percent;

    if (!pre_carriage_enabled && progress_percent < thresholds.departure) {
      progress_percent = 0;
    }

    const shipmentTypeIcon = type === 'air' ? 'air' : 'trade-ship';

    const { publicShipment } = this.props;

    const delayClassModifier = (
      !updated_estimated_arrival
      || getDateDiff(updated_estimated_arrival, estimated_arrival) < 0
    ) ? 'minor' : 'major';

    let divider = '';
    const isInTransit = shipmentGroups.status.groupBy(this.props.data) === 'inTransit';

    let toEtaView: any = null;
    if (show_to_eta && isInTransit) {
      toEtaView = (
        <span className="shipment__status-eta">
          {getToETA(estimated_arrival)}
        </span>
      );
      divider = '| ';
    }

    let delayedDaysView: any = null;
    if (delayed_days && isInTransit) {
      delayedDaysView = (
        <span
          className={`shipment__status-delay shipment__status-delay_${delayClassModifier}`}
        >
          {delayed_days}
        </span>
      );
      divider = '| ';
    }

    const activityClassModifier = status === 'pre_booked' ? 'shipment_passive' : '';
    return (
      <article className={`shipment ${activityClassModifier}`}>
        <Link
          className="shipment__general"
          to={`/shipments/${id}/`}
        >
        <div className="shipment__block">
          <div className="shipment__main">
            <header className="shipment__title">
              {title}
              <i className={`shipment__title-icon icon ${shipmentTypeIcon}`} />
            </header>
            <div className="shipment__reference">{reference_number || '-'}</div>
            <div className="shipment__status">
              <i
                className={`shipment__status-icon icon ${documentation_valid ? 'success' : 'attention'}`}
              />
              <span className="shipment__line shipment__status-type">{humanized_status}</span>
              {(!publicShipment) && <>
                {divider}
                {toEtaView}
                {delayedDaysView}
              </>}
            </div>
            <div className="shipment__line shipment__line_amount">
              <span className="shipment__logo">
                {(carrier_logo)
                  ? <img
                      src={carrier_logo}
                      alt={carrier_name}
                      className="shipment__logo-img"
                  />
                  : carrier_name
                }
              </span>
              {total_quantity} x {container_type}
            </div>
          </div>
          <div className="shipment__ports">
            <div className="shipment__timeline">
              <div
                className="shipment__timeline_progress"
                style={{ width: `${progress_percent + 1}%`}}
              />
            </div>
            {this.renderPortPrecarriage(progress_percent)}
            {this.renderPortLoading(progress_percent)}
            {this.renderPortDischarge(progress_percent)}
            {this.renderPortDelivery(progress_percent)}
          </div>
        </div>
        </Link>
      </article>
    );
  }

  private renderPortPrecarriage(progressPercent: number): ReactNode{
    if (this.props.data == null){
      return null
    }

    const {
      pre_carriage_enabled,
      pre_carriage_address,
      estimated_pickup,
      estimated_departure,
      pickup_date,
      planned_pickup,
      pickup_date_set_by_client,
      status,
    } = this.props.data;

    let completedStyle = 'shipment__port-node_disabled';

    const title = (pre_carriage_enabled) ? pre_carriage_address : 'Not included';

    let icon: ReactNode | null = null;
    let content: string = '';

    if (pre_carriage_enabled) {
      completedStyle = '';
      if (estimated_departure && status !== 'shipment_not_ready') {
        content = (pickup_date)
          ? `SPD: ${planned_pickup}`
          : `EPD: ${formatDate(estimated_pickup)}`;
      }
      icon = (pickup_date_set_by_client)
        ? <i className="shipment__port-icon icon success" />
        : <i className="shipment__port-icon icon attention" />;

    } else if(moment().isBefore(estimated_departure) && !pickup_date_set_by_client) {
      content = 'Pre-Carriage Available'
    }
    if(progressPercent > thresholds.precarriage){
      completedStyle = 'shipment__port-node_completed'
    }


    return(
      <div className="shipment__port">
        <i
          className={`
           shipment__port-node
           shipment__port-node_start
           shipment__port-node_mark
           ${completedStyle}
          `}
        />
        <header className="shipment__port-name shipment__line">
          {title}
        </header>
        <div className="shipment__line">
          {content}{icon}
        </div>
      </div>
    )
  }

  private renderPortLoading(progressPercent: number): ReactNode{
    if (this.props.data == null){
      return null
    }

    const {
      loading_port_code,
      loading_port,
      loading_port_country,
      estimated_departure,
      status,
      type,
    } = this.props.data;

    const completedStyle = progressPercent >= thresholds.departure
      ? 'shipment__port-node_completed'
      : '';

    const seafreightRequested = !!loading_port_code;

    const nodeIcon = type === 'air' ? 'air-depart' : 'cargo';

    let flag: ReactNode | null = null;
    let content: ReactNode = 'Seafreight Available';
    let dateLine: string = '';
    if (seafreightRequested) {
      flag = <span className={`shipment__port-flag flag-icon flag-icon-${loading_port_country.toLowerCase()}`}/>;
      content = <span className="shipment__port-name">{loading_port}, {loading_port_country} {flag} </span>;

      dateLine = 'Unknown yet';
      // if (status !== 'shipment_not_ready') {
      if (estimated_departure) {
        dateLine = `ETD: ${formatDate(estimated_departure)}`
      }
    }

    return(
      <div className="shipment__port">
        <i
          className={`
           shipment__port-node
           shipment__port-node_middle
           shipment__port-node_${nodeIcon}
           ${completedStyle}
          `}
        />
        <header className="shipment__port-id shipment__line">
          {seafreightRequested ? loading_port_code : 'Not Included'}
        </header>
        <div className="shipment__line shipment__port-city">
          {content}
        </div>
        <div className="shipment__line">
          {dateLine}
        </div>
      </div>
    )
  }

  private renderPortDischarge(progressPercent: number): ReactNode{
    if (this.props.data == null){
      return null
    }

    const {
      discharge_port_code,
      discharge_port,
      discharge_port_country,
      current_estimated_arrival,
      estimated_arrival,
      type,
    } = this.props.data;

    const nodeIcon = type === 'air' ? 'air-arrive' : 'cargo';

    const completedStyle = (progressPercent >= thresholds.arrival)
      ? 'shipment__port-node_completed'
      : '';

    const seafreightRequested = !!discharge_port_code;

    let flag: ReactNode | null = null;
    let content: ReactNode = 'Seafreight Available';
    let dateLine: string = '';
    if (seafreightRequested) {
      flag = <span className={`shipment__port-flag flag-icon flag-icon-${discharge_port_country.toLowerCase()}`}/>;
      content = <span className="shipment__port-name">{discharge_port}, {discharge_port_country} {flag}</span>;

      dateLine = 'Unknown yet';
      // if (status !== 'shipment_not_ready') {
      if (current_estimated_arrival) {
        dateLine = `ETA: ${formatDate(current_estimated_arrival)}`
      }
    }

    return(
      <div className="shipment__port">
        <i
          className={`
           shipment__port-node
           shipment__port-node_middle
           shipment__port-node_${nodeIcon}
           ${completedStyle}
          `}
        />
        <header className="shipment__port-id shipment__line">
          {seafreightRequested ? discharge_port_code : 'Not Included'}
        </header>
        <div className="shipment__line shipment__port-city">
          {content}
        </div>
        <div className="shipment__line">
          {dateLine}
        </div>
      </div>
    )
  }

  private renderPortDelivery(progressPercent: number): ReactNode {
    if (this.props.data == null){
      return null
    }

    const {
      on_carriage_enabled,
      post_carriage_address,
      estimated_delivery,
      estimated_arrival,
      planned_delivery_date,
      planned_delivery,
      estimated_departure,
      status,
      id,
    } = this.props.data;

    const completedStyle = (progressPercent > thresholds.delivery)
      ? 'shipment__port-node_completed'
      : '';

    const title = (on_carriage_enabled) ? post_carriage_address : 'Not included';

    let icon: ReactNode | null = null;
    let content: ReactNode = '';

    if (on_carriage_enabled) {
      if (estimated_arrival && status !== 'shipment_not_ready') {
        if (planned_delivery_date) {
          content = `SDD: ${planned_delivery}`;
          icon = <i className="shipment__port-icon icon success" />
        } else {
          content = `EDD: ${formatDate(estimated_delivery)}`;
          if (includes(['arriving_at_pod', 'container_discharge_at_pod'], status)){
            icon = <i className="shipment__port-icon icon attention" />;
          }
        }
      }

    } else if (
      moment().isBefore(moment(estimated_departure).subtract(3, 'days'))
    ) {
      content = 'On-Carriage Available'
    }

    return(
      <div className="shipment__port">
        <div className="shipment__port-node-line">
          <i
            className={`
              shipment__port-node
              shipment__port-node_end
              shipment__port-node_mark
              ${completedStyle}
            `}
          />
          {
            (!this.props.publicShipment) &&
              <Link
                className="shipment__port-button-container"
                to={`/shipments/${id}/track`}
              >
                <Button
                  color="grey-outline"
                  className="shipment__port-button"
                >
                  Track
                  <i className="shipment__port-button-icon icon chevron" />
                </Button>
              </Link>
          }

        </div>
        <header className="shipment__port-name shipment__line">
          {title}
        </header>
        <div className="shipment__line shipment__line_uncut">
          {content}{icon}
        </div>
      </div>
    )
  }
}

export default Shipment;
