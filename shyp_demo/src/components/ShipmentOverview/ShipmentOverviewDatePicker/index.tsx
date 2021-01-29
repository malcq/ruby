import React, { PureComponent, ReactNode } from 'react';
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import moment from 'moment';
import classNames from 'classnames/bind';
import bind from "autobind-decorator";
import { hasIn } from 'lodash';

import { DATE_FORMAT, DATE_PICKER_TIME_INTERVALS } from '../../../config/constants';
import { ForbiddenEditHider } from '../../';
import ShipmentOverviewDatePickerInput from "../ShipmentOverviewDatePickerInput/index";
import { toMoment } from '../utils';

import { resourceKey } from '../../../config/permissions';
import './styles.scss';

interface IShipmentOverviewDatePicker {
  selected: any;
  timeInterval: number;
  inputText: string;
  onConfirm: any;
  minDate: any;
  maxDate: any;
  showTimeInterval: boolean;
  defaultDate: any,
  showInputText: boolean;
  isBlackColorInputText: boolean;
  isPencilIconInputText: boolean;
  popperPlacement: string,
}

class ShipmentOverviewDatePicker extends PureComponent<IShipmentOverviewDatePicker, any> {
  public static propTypes = {
    selected: PropTypes.object,
    timeInterval: PropTypes.number,
    inputText: PropTypes.string,
    onConfirm: PropTypes.func,
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
    showTimeInterval: PropTypes.bool,
    defaultDate: PropTypes.object,
    showInputText: PropTypes.bool,
    isBlackColorInputText: PropTypes.bool,
    isPencilIconInputText: PropTypes.bool,
    popperPlacement: PropTypes.string,
  };

  public static defaultProps = {
    selected: null,
    timeInterval: null,
    inputText: 'Date',
    onConfirm: () => {},
    minDate: undefined,
    maxDate: undefined,
    showTimeInterval: false,
    defaultDate: moment(),
    showInputText: false,
    isBlackColorInputText: false,
    isPencilIconInputText: false,
    popperPlacement: 'top-start',
  };

  private datePickerRef;

  constructor(props){
    super(props);
    this.datePickerRef = React.createRef();
    this.state = {
      selectedState: null,
      timeIntervalState: null,
    };
  }

  public renderDatePicker(): ReactNode {
    const {
      selected,
      inputText,
      timeInterval,
      minDate,
      maxDate,
      showTimeInterval,
      defaultDate,
      showInputText,
      isBlackColorInputText,
      isPencilIconInputText,
      popperPlacement,
    } = this.props;

    const {
      selectedState,
      timeIntervalState,
    } = this.state;

    return (
      <DatePicker
        ref={this.datePickerRef}
        selected={
          selectedState
          || toMoment(selected)
          || toMoment(defaultDate)
          || moment()
        }
        onChange={this.handleChangeDate}
        onClickOutside={this.cancel}
        shouldCloseOnSelect={false}
        popperPlacement={popperPlacement}
        popperClassName={classNames('react-datepicker-popper', {
          'react-datepicker-popper--top-end': popperPlacement === 'top-end',
        })}
        minDate={minDate != null && moment(minDate).isValid() ? moment(minDate) : undefined}
        maxDate={maxDate != null && moment(maxDate).isValid() ? moment(maxDate) : undefined}
        forceShowMonthNavigation={true}
        previousMonthButtonLabel=""
        nextMonthButtonLabel=""
        customInput={
          <ShipmentOverviewDatePickerInput
            inputText={inputText}
            showInputText={showInputText}
            selected={selected}
            timeInterval={timeInterval}
            showTimeInterval={showTimeInterval}
            isBlackColorInputText={isBlackColorInputText}
            isPencilIconInputText={isPencilIconInputText}
          />
        }
      >
        {showTimeInterval && (
          <Select
            className="shipment-overview-date-picker__time-interval-select"
            value={timeIntervalState == null ? timeInterval || 0 : timeIntervalState}
            valueKey="id"
            labelKey="name"
            clearable={false}
            searchable={false}
            onChange={this.handleChangeTimeInterval}
            options={DATE_PICKER_TIME_INTERVALS}
          />)
        }
        <div className="shipment-overview-date-picker__control-buttons">
          <button
            onClick={this.cancel}
            className="shipment-overview-date-picker__button"
          >
            Cancel
          </button>
          <button
            className="shipment-overview-date-picker__button shipment-overview-date-picker__button--confirm"
            onClick={this.confirm}
          >
            Confirm
          </button>
        </div>
      </DatePicker>
    )
  }

  public render() {
    const { selected } = this.props

    return (
      <div className="shipment-overview-date-picker">
        <ForbiddenEditHider
          resource={resourceKey.shipmentUpdate}
          placeholder={
            hasIn(selected, 'format') ? selected!.format('DD MMM YYYY') : 'Not Set'
          }
        >
          {this.renderDatePicker()}
        </ForbiddenEditHider>
      </div>
    );
  }

  @bind
  private handleChangeDate(date: any): void{
    this.setState({
      selectedState: date,
    });
  }

  @bind
  private handleChangeTimeInterval(selectedValue: any): void{
    if (selectedValue != null ) {
      this.setState({
        timeIntervalState: selectedValue.id,
      })
    }
  }

  @bind
  private cancel(): void{
    this.setState({
      selectedState: null,
      timeIntervalState: null,
    });
    this.datePickerRef.current.setOpen(false);
  }

  @bind
  private confirm(): void{
    const { selected, defaultDate, timeInterval, showTimeInterval } = this.props;
    const { selectedState, timeIntervalState } = this.state;
    const data = {
      selectedState,
      timeIntervalState,
    };

    if (selectedState != null) {
      data.selectedState = selectedState.format(DATE_FORMAT);
    } else {
      data.selectedState = moment(selected).isValid() ? null :
        (moment(defaultDate).isValid() ? moment(defaultDate).format(DATE_FORMAT) : moment())
    }

    if (showTimeInterval) {
      if (timeIntervalState != null) {
        data.timeIntervalState = timeIntervalState;
      } else {
        data.timeIntervalState = timeInterval != null ? null : 0
      }
    }

    this.props.onConfirm(data);

    this.setState({
      selectedState: null,
      timeIntervalState: null,
    });
    this.datePickerRef.current.setOpen(false);
  }
}

export default ShipmentOverviewDatePicker;