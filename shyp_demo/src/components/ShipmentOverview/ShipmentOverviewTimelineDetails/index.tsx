import React, { PureComponent, ReactNode } from 'react';
import classNames from 'classnames/bind';
import PropTypes from "prop-types";
import moment, { Moment } from 'moment';
import bind from "autobind-decorator";
import Autocomplete from 'react-google-autocomplete';
import { isEmpty, includes, hasIn, toLower } from 'lodash';

import withoutNullFields from "../../../utils/withoutNullFields";
import ShipmentOverviewDatePicker from "../ShipmentOverviewDatePicker";
import ShipmentOverviewDelivery from "../ShipmentOverviewDelivery";
import { isFCL, getLatestPrecarriageDate } from '../utils';
import { Logger } from '../../../utils';

import { DATE_FORMAT } from '../../../config/constants';

import './styles.scss';

interface IShipmentOverviewTimelineDetailsProps {
  data: any;
  submit: any;
  showError: (message: string, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
}

interface IShipmentOverviewTimelineDetailsState {
  isEditDeliveryAddress: boolean;
  deliveryAddress: object;
}

function toMoment(date: string): Moment | undefined {
  const momentDate = moment
    .utc(date, DATE_FORMAT);

  if (!momentDate.isValid()) {
    return undefined
  }
  return momentDate
}

class ShipmentOverviewTimelineDetails extends PureComponent<IShipmentOverviewTimelineDetailsProps, IShipmentOverviewTimelineDetailsState> {
  public static propTypes = {
    data: PropTypes.object,
    submit: PropTypes.func,
    showError: PropTypes.func,
    showSuccess: PropTypes.func,
  };

  public static defaultProps = {
    data: {},
    submit() {},
    showError(message: string) {},
    showSuccess(message: string) {}
  };

  constructor(props){
    super(props);
    this.state = {
      isEditDeliveryAddress: false,
      deliveryAddress: {},
    }
  }

  private getCurrentDate(): Moment {
    const { data } = this.props;
    return moment.unix(data.timestamp)
      .utc()
      .set({
        hour:0,
        minute:0,
        second:0,
        millisecond:0
      });
  }

  private renderDate(date?: Moment | null): ReactNode {
    return this.renderDateString(
      hasIn(date, 'format') ? date!.format('DD MMM YYYY') : ''
    )
  }

  private renderDateString(dateString?: string | null): ReactNode{
    return (
      <div className="shipment-overview-timeline-details__shipment-port-date">
        {dateString || ''}
      </div>
    )
  }

  private renderPortContent(title: string, content?: ReactNode, icon?: ReactNode){
    return (
      <div className="shipment-overview-timeline-details__shipment-port-date-container">
        <div className="shipment-overview-timeline-details__shipment-cell-header">
          {title}{icon}
        </div>
        {content}
      </div>
    )
  }

  private renderPreCarriageContent(): ReactNode {
    const shipment = this.props.data;

    if (!shipment.pre_carriage_enabled) {
      return null
    }

    if (!(
      shipment.estimated_departure
      && shipment.status !== 'shipment_not_ready'
    )) {
      return null
    }

    const currentDate = this.getCurrentDate();
    const tomorrow = currentDate.add(1, 'day');
    const maxPossiblePickupDate = getLatestPrecarriageDate(shipment) || tomorrow;

    let title: string = 'Estimated Pick-up Date:';
    let content: ReactNode = null;
    let icon: ReactNode = null;

    let datepickerContent = (
      <ShipmentOverviewDatePicker
        isPencilIconInputText={true}
        selected={moment.utc(shipment.pickup_date, DATE_FORMAT)}
        showInputText={!shipment.pickup_date}
        inputText="Select Pick-up Date"
        timeInterval={shipment.pickup_time}
        defaultDate={tomorrow}
        minDate={currentDate}
        maxDate={maxPossiblePickupDate}
        showTimeInterval={
          isFCL(shipment)
        }
        onConfirm={this.confirmPickupDate}
      />
    );

    if (shipment.pickup_date) {
      title = 'Confirmed Pick-up Date:';
      content = this.renderDateString(shipment.planned_pickup);
      if (currentDate < maxPossiblePickupDate && !shipment.pickup_date_set_by_client) {
        content = datepickerContent;
      } else {
        icon = (
          <i
            className="
             shipment-overview-timeline-details__pick-up-date-header-icon-green
             icon
             checkcircle
            "
          />
        )
      }
    } else {
      if (currentDate < maxPossiblePickupDate) {
        title = 'Scheduled Pick-up Date:';
        content = datepickerContent;
        icon = (
          <i
            className="
             shipment-overview-timeline-details__pick-up-date-header-icon-red
             icon
             attention
            "
          />
        )

      } else {
        content = this.renderDate(toMoment(shipment.estimated_pickup))
      }
    }

    return this.renderPortContent(title, content, icon);
  };

  public render() {
    const { data } = this.props;

    return (
      <div className="shipment-overview-timeline-details">
        <div className={classNames('shipment-overview-timeline-details__shipment-cell-container',
          'shipment-overview-timeline-details__shipment-cell-container--start')}>
          <div className="shipment-overview-timeline-details__shipment-cell">
            <div className="shipment-overview-timeline-details__shipment-cell-header">
              Departure Address
            </div>
            <div className="shipment-overview-timeline-details__shipment-port-code">
              {data.pre_carriage_enabled ? data.pre_carriage_address : 'Not Included'}
            </div>
            {this.renderPreCarriageContent()}
          </div>
        </div>
        <div className="shipment-overview-timeline-details__shipment-cell-container">
          <div className="shipment-overview-timeline-details__shipment-cell">
            <div className="shipment-overview-timeline-details__shipment-cell-header">
              Port of Loading
            </div>
            <div className="shipment-overview-timeline-details__shipment-port-code">
              {data.loading_port_code != null ? data.loading_port_code : ''}
            </div>
            <div className="shipment-overview-timeline-details__shipment-port-country">
              <div className="shipment-overview-timeline-details__shipment-port-country-text">
                {data.loading_port != null ? data.loading_port : ''}
                {data.loading_port != null && data.loading_port_country != null ? ', ' : ''}
                {data.loading_port_country != null ? data.loading_port_country : ''}
              </div>
              {data.loading_port_country != null && (
                <span className={classNames(
                  'shipment-overview-timeline-details__shipment-port-country__icon',
                  'flag-icon',
                  `flag-icon-${data.loading_port_country.toLowerCase()}`,
                )}/>)
              }
            </div>
            <div className="shipment-overview-timeline-details__shipment-port-date-container">
              <div className="shipment-overview-timeline-details__shipment-cell-header">
                Estimated Date of Departure:
              </div>
              <div className="shipment-overview-timeline-details__shipment-port-date">
                {data.estimated_departure != null && data.status !== 'shipment_not_ready' ?
                  moment.utc(data.estimated_departure, 'YYYY-MM-DD').format('DD MMM YYYY') : 'Unknown yet'}
              </div>
            </div>
            <div className="shipment-overview-timeline-details__shipment-port-date-container">
              <div className="shipment-overview-timeline-details__shipment-cell-header">
                Cargo Closing Date:
              </div>
              <div className="shipment-overview-timeline-details__shipment-port-date">
                {data.cargo_closing_date != null && data.status !== 'shipment_not_ready' ?
                  moment.utc(data.cargo_closing_date, 'YYYY-MM-DD').format('DD MMM YYYY') : 'Unknown yet'}
              </div>
            </div>
          </div>
        </div>
        <div className="shipment-overview-timeline-details__shipment-cell-container">
          <div className="shipment-overview-timeline-details__shipment-cell">
            <div className="shipment-overview-timeline-details__shipment-cell-header">
              Port of Discharge
            </div>
            <div className="shipment-overview-timeline-details__shipment-port-code">
              {data.discharge_port_code != null ? data.discharge_port_code : ''}
            </div>
            <div className="shipment-overview-timeline-details__shipment-port-country">
              <div className="shipment-overview-timeline-details__shipment-port-country-text">
                {data.discharge_port != null ? data.discharge_port : ''}
                {data.discharge_port != null && data.discharge_port_country != null ? ', ' : ''}
                {data.discharge_port_country != null ? data.discharge_port_country : ''}
              </div>
              {data.discharge_port_country != null && (
                <span className={classNames(
                  'shipment-overview-timeline-details__shipment-port-country__icon',
                  'flag-icon',
                  `flag-icon-${data.discharge_port_country.toLowerCase()}`,
                )}/>)
              }
            </div>
            <div className="shipment-overview-timeline-details__shipment-port-date-container">
              <div className="shipment-overview-timeline-details__shipment-cell-header">
                Estimated Date of Arrival
              </div>
              <div className="shipment-overview-timeline-details__shipment-port-date">
                {data.current_estimated_arrival != null && data.status !== 'shipment_not_ready' ?
                  moment.utc(data.current_estimated_arrival, 'YYYY-MM-DD').format('DD MMM YYYY') : 'Unknown yet'}
              </div>
            </div>
          </div>
        </div>
        <ShipmentOverviewDelivery
          data = {this.props.data}
          submit={this.props.submit}
          showError={this.props.showError}
          showSuccess={this.props.showSuccess}
        />
      </div>
    );
  }

  @bind
  private async confirmPickupDate(data): Promise<any>{
    const dataToSend = {
      pickup_date: data.selectedState,
      pickup_time: data.timeIntervalState,
    };

    const { showSuccess, showError } = this.props;
    try {
      await this.props.submit(this.props.data.id, withoutNullFields(dataToSend));

      if (showSuccess) {
        showSuccess('Pickup date confirmed. Shipment is updated', 4000 /* 4 sec */)
      }
    } catch(error) {
      if (showError) {
        showError('Pick-up date not in valid range')
      }
      Logger.log(error)
    }
  }

  @bind
  private onClickEditDeliveryAddress(): void{
    this.setState({
      isEditDeliveryAddress: true,
      deliveryAddress: {},
    });
  }

  @bind
  private onClickCancelEditDeliveryAddress(): void{
    this.setState({
      isEditDeliveryAddress: false,
      deliveryAddress: {},
    });
  }

  @bind
  private async onClickSaveDeliveryAddress(): Promise<any>{
    const { deliveryAddress } = this.state;

    if (isEmpty(withoutNullFields(deliveryAddress))) {
      this.props.showError('Address not found. Please enter a valid address');
      return;
    }

    try {
      await this.props.submit(this.props.data.id, withoutNullFields(deliveryAddress));
      this.setState({
        isEditDeliveryAddress: false,
        deliveryAddress: {},
      });
    } catch(error) {
      Logger.log(error)
    }
  }
}

export default ShipmentOverviewTimelineDetails
