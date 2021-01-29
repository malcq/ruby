import React, { PureComponent } from 'react';
import classNames from 'classnames/bind';
import PropTypes from "prop-types";
import moment, { Moment } from 'moment';
import bind from "autobind-decorator";
import Autocomplete from 'react-google-autocomplete';
import { isEmpty, includes, noop } from 'lodash';

import { Logger, withoutNullFields } from "../../../utils";
import ShipmentOverviewDatePicker from "../ShipmentOverviewDatePicker";
import { ForbiddenEditHider } from '../../';
import { DATE_FORMAT } from '../../../config/constants';
import { resourceKey } from '../../../config/permissions';
import { getEarliestOnCarriageDate } from '../utils';
import './styles.scss';

interface IShipmentOverviewDeliveryProps {
  data: IDetailedShipment;
  submit: (id: number, value: any) => void;
  showError: (message: string, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
}

interface IShipmentOverviewDeliveryState {
  isEditDeliveryAddress: boolean;
  deliveryAddress: object;
}

class ShipmentOverviewDelivery extends PureComponent<IShipmentOverviewDeliveryProps, IShipmentOverviewDeliveryState> {
  public static propTypes = {
    data: PropTypes.object,
    submit: PropTypes.func,
    showError: PropTypes.func
  };

  public static defaultProps = {
    data: {},
    submit() {},
    showError() {}
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isEditDeliveryAddress: false,
      deliveryAddress: {},
    }
  }

  public render() {
    const shipment = this.props.data;
    if (isEmpty(shipment)) return null;
    return (
      <div className={classNames('shipment-overview-timeline-details__shipment-cell-container',
        'shipment-overview-timeline-details__shipment-cell-container--end')}>
        <div className="shipment-overview-timeline-details__shipment-cell">
          <div className="shipment-overview-timeline-details__pick-up-date-header">
            <div className="shipment-overview-timeline-details__shipment-cell-header">
              Delivery Address:
            </div>

            { shipment.on_carriage_enabled
              ? (
                <ForbiddenEditHider resource={resourceKey.shipmentUpdate}>
                  {this.renderEditDeliveryAddressButtons()}
                </ForbiddenEditHider>
              )
              : ''
            }
          </div>
          { shipment.on_carriage_enabled ? this.renderLogic() : 'Not Included'}
        </div>
      </div>
    );
  }

  private renderLogic(): any {
    const shipment = this.props.data;
    const { isEditDeliveryAddress } = this.state;
    let renderDateState: () => any = noop;

    if (this.currentDate().toDate() > new Date(shipment.current_estimated_arrival)
        || includes(['arriving_at_pod', 'container_discharge_at_pod'], shipment.status)
    ) {
      if (shipment.planned_delivery_date != null) {
        if (shipment.delivery_date_set_by_client
            || includes(
                [
                  'delivered',
                  'customs_outbound_on_hold',
                  'customs_outbound',
                  'in_transit_inland_transport'
                ],
                shipment.status
              )
        ) {
          renderDateState = this.renderConfirmedFrozen
        }
        else {
          renderDateState = this.renderConfirmedEditable
        }
      } else {
        renderDateState = this.renderScheduledEditable
      }
    } else {
      if (shipment.planned_delivery_date != null) {
        renderDateState = this.renderScheduledFrozen
      } else {
        renderDateState = this.renderEstimatedFrozen
      }
    }

    return [
      isEditDeliveryAddress
        ? this.renderAutocomplete()
        : (
          <div
            key="shipment-overview-timeline-details__shipment-port-code"
            className="shipment-overview-timeline-details__shipment-port-code"
          >
            {shipment.post_carriage_address != null ? shipment.post_carriage_address : ''}
          </div>
        ),
      shipment.status !== 'shipment_not_ready'
        && (
          <div
            key="shipment-overview-timeline-details__delivery-date"
            className="shipment-overview-timeline-details__delivery-date"
          >
              { renderDateState() }
          </div>
        )
    ]
  }

  @bind
  private renderScheduledEditable(): any {
    const shipment = this.props.data;
    const today = this.currentDate();
    const minDeliveryDate = getEarliestOnCarriageDate(shipment) || today;
    const minViableDeliveryDate = minDeliveryDate > today ? minDeliveryDate : today;
    const maxDeliveryDate = moment(shipment.max_delivery_date);


    if (includes(
      [
        'delivered',
        'customs_outbound_on_hold',
        'in_transit_inland_transport',
        'customs_outbound'
      ],
      shipment.status
    )) {
      return null;
    }

    return [
      <div
        key="shipment-overview-timeline-details__delivery-date-header"
        className="shipment-overview-timeline-details__delivery-date-header "
      >
        <div className="shipment-overview-timeline-details__shipment-cell-header">
          Scheduled Delivery Date:
        </div>
        <i className="shipment-overview-timeline-details__delivery-date-header-icon-red icon attention"/>
      </div>,
      <ShipmentOverviewDatePicker
        isPencilIconInputText={true}
        key="shipment-overview-timeline-details__delivery-date-picker"
        timeInterval={shipment.planned_delivery_time}
        defaultDate={minViableDeliveryDate.add(1, 'day')}
        minDate={minViableDeliveryDate}
        maxDate={maxDeliveryDate}
        inputText="Pick Delivery Date"
        showInputText={true}
        showTimeInterval={
          includes(['20 ft', '40 ft', '40ft HQ'], shipment.container_type)
        }
        onConfirm={this.confirmDeliveryDate}
        popperPlacement="top-end"
      />,
    ]
  }

  @bind
  private renderConfirmedFrozen(): any {
    const shipment = this.props.data;

    return (
      <React.Fragment>
        <div className="shipment-overview-timeline-details__delivery-date-header">
          <div className="shipment-overview-timeline-details__shipment-cell-header">
            Confirmed Delivery Date:
          </div>
          <i className="shipment-overview-timeline-details__delivery-date-header-icon-green icon checkcircle"/>
        </div>
        <div className="shipment-overview-timeline-details__shipment-port-date">
          { shipment.planned_delivery || '' }
        </div>
      </React.Fragment>
    )
  }

  @bind
  private renderConfirmedEditable(): any {
    const shipment = this.props.data;
    const today = this.currentDate();
    const minDeliveryDate = getEarliestOnCarriageDate(shipment) || today;
    const minViableDeliveryDate = minDeliveryDate > today ? minDeliveryDate : today;

    const maxDeliveryDate = moment(shipment.max_delivery_date);

    let estimatedDeliveryTime: any = moment.utc(shipment.estimated_delivery, DATE_FORMAT);
    estimatedDeliveryTime = estimatedDeliveryTime.isValid()
      ? estimatedDeliveryTime
      : undefined;

    return [
      <div
        key="shipment-overview-timeline-details__shipment-cell-header"
        className="shipment-overview-timeline-details__shipment-cell-header"
      >
        Confirmed Delivery Date:
      </div>,
      <ShipmentOverviewDatePicker
        key="shipment-overview-timeline-details__shipment-date-picker"
        selected={moment.utc(shipment.planned_delivery_date || undefined, DATE_FORMAT)}
        timeInterval={shipment.planned_delivery_time}
        defaultDate={estimatedDeliveryTime}
        minDate={minViableDeliveryDate}
        maxDate={maxDeliveryDate}
        inputText={shipment.planned_delivery || undefined}
        isBlackColorInputText={true}
        isPencilIconInputText={true}
        showInputText={true}
        showTimeInterval={
          includes(['20 ft', '40 ft', '40ft HQ'], shipment.container_type)
        }
        onConfirm={this.confirmDeliveryDate}
        popperPlacement="top-end"
      />
    ]
  }

  @bind
  private renderEstimatedFrozen(): any {
    const shipment = this.props.data;

    if (shipment.post_carriage_address === null) {
      return null;
    }

    return (
      <div className="shipment-overview-timeline-details__shipment-port-date-container">
        <div className="shipment-overview-timeline-details__shipment-cell-header">
          Estimated Delivery Date:
        </div>
        <div className="shipment-overview-timeline-details__shipment-port-date">
          {shipment.estimated_delivery != null ?
            moment.utc(shipment.estimated_delivery, DATE_FORMAT).format('DD MMM YYYY') : ''}
        </div>
      </div>
    )
  }

  @bind
  private renderScheduledFrozen(): any {
    const shipment = this.props.data;
    return (
      <div className="shipment-overview-timeline-details__shipment-port-date-container">
        <div className="shipment-overview-timeline-details__shipment-cell-header">
          Scheduled Delivery Date:
        </div>
        <div className="shipment-overview-timeline-details__shipment-port-date">
          {shipment.planned_delivery != null ? shipment.planned_delivery : ''}
        </div>
      </div>
    )
  }

  private renderEditDeliveryAddressButtons(): any {
    const shipment = this.props.data;

    if (new Date(shipment.current_estimated_arrival) < this.currentDate().toDate()) {
      return null;
    }

    if (this.state.isEditDeliveryAddress) {
       return [
         <i
           key="shipment-overview-timeline-details__cancel-details"
           className="shipment-overview-timeline-details__delivery-date-header-icon-grey icon close"
           onClick={this.onClickCancelEditDeliveryAddress}
         />,
         <i
           key="shipment-overview-timeline-details__save-details"
           className="shipment-overview-timeline-details__delivery-date-header-icon-grey icon check"
           onClick={this.onClickSaveDeliveryAddress}
         />
       ]
    } else {
      return (
        <i
          className="shipment-overview-timeline-details__delivery-date-header-icon-grey icon request-quote"
          onClick={this.onClickEditDeliveryAddress}
        />
      )
    }
  }

  private renderAutocomplete(): any {
    return (
      <Autocomplete
        className="shipment-overview-timeline-details__google-input"
        onPlaceSelected={(place) => {
          if (place != null && place.address_components != null && place.address_components.length > 0) {
            const deliveryAddress = {
              delivery_address: place.formatted_address,
              delivery_lat: place.geometry.location.lat(),
              delivery_lng: place.geometry.location.lng(),
              delivery_country: undefined,
              delivery_zip: undefined,
            };
            place.address_components.forEach(item => {
              if (item.types.includes('country')) {
                deliveryAddress.delivery_country = item.short_name
              }
              if (item.types.includes('postal_code')) {
                deliveryAddress.delivery_zip = item.short_name
              }
            });
            this.setState({
              deliveryAddress,
            });
          }
        }}
        placeholder="Search address"
        types={['geocode', 'establishment']}
        language={'en'}
        onChange={this.changeAutocompleteHandler}
      />
  )
  }

  @bind
  private changeAutocompleteHandler() : void {
    this.setState({
      deliveryAddress: {}
    });
  }

  @bind
  private async confirmDeliveryDate(data): Promise<any>{
    const dataToSend = {
      planned_delivery_date: data.selectedState,
      planned_delivery_time: data.timeIntervalState,
    };

    try {
      await this.props.submit(this.props.data.id, withoutNullFields(dataToSend))
    } catch(error) {
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

    const { showSuccess, showError } = this.props;
    try {
      await this.props.submit(this.props.data.id, withoutNullFields(deliveryAddress));
      this.setState({
        isEditDeliveryAddress: false,
        deliveryAddress: {},
      });

      if( showSuccess ) {
        showSuccess('Delivery date confirmed. Shipment is updated', 4000 /* 4 sec */)
      }
    } catch(error) {
      if(showError) {
        showError('Delivery date is not in valid range')
      }
      Logger.log(error)
    }
  }

  @bind
  private currentDate(): Moment {
    const date = this.props.data.timestamp || (new Date()).getTime();
    return moment.unix(date).utc().set({
       hour: 0,
       minute: 0,
       second: 0,
       millisecond: 0
     });
  }
}

export default ShipmentOverviewDelivery
