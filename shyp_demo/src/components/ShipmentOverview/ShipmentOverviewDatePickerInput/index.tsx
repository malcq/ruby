import React, { PureComponent } from "react";
import classNames from 'classnames/bind';
import PropTypes from "prop-types";
import moment from 'moment';

import { DATE_PICKER_TIME_INTERVALS } from '../../../config/constants';

import './styles.scss';

interface IShipmentOverviewDatePickerInput {
  inputText: string;
  showInputText: boolean;
  onClick?: any;
  selected: any;
  timeInterval: number;
  showTimeInterval: boolean;
  isBlackColorInputText: boolean;
  isPencilIconInputText: boolean;
}

class ShipmentOverviewDatePickerInput extends PureComponent<IShipmentOverviewDatePickerInput, any> {
  public static propTypes = {
    inputText: PropTypes.string,
    showInputText: PropTypes.bool,
    onClick: PropTypes.func,
    selected: PropTypes.object,
    timeInterval: PropTypes.number,
    showTimeInterval: PropTypes.bool,
    isBlackColorInputText: PropTypes.bool,
    isPencilIconInputText: PropTypes.bool,
  };

  public static defaultProps = {
    inputText: 'No Date',
    showInputText: false,
    onClick() {},
    selected: null,
    timeInterval: null,
    showTimeInterval: false,
    isBlackColorInputText: false,
    isPencilIconInputText: false,
  };

  public render() {
    const {
      inputText,
      showInputText,
      onClick,
      selected,
      timeInterval,
      showTimeInterval,
      isBlackColorInputText,
      isPencilIconInputText,
    } = this.props;

    let timeIntervalObj;

    if (timeInterval != null) {
      timeIntervalObj = DATE_PICKER_TIME_INTERVALS.find(item => {
        return item.id === timeInterval;
      })
    }

    return (
      <div className="shipment-overview-date-picker-input" onClick={onClick}>
        {showInputText ? (
          <React.Fragment>
            <div className={classNames('shipment-overview-date-picker-input__text', {
              'shipment-overview-date-picker-input__text--color-black': isBlackColorInputText,
            })}>
              {inputText}
            </div>
            <i
              className={classNames('shipment-overview-date-picker-input__icon', 'icon', {
                'chevron': !isPencilIconInputText,
                'shipment-overview-date-picker-input__icon--rotate-90deg': !isPencilIconInputText,
                'request-quote': isPencilIconInputText,
              })}
            />
          </React.Fragment>
          ) : (
          <React.Fragment>
            <div className="shipment-overview-date-picker-input__text">
              {selected != null && moment(selected).isValid() ? moment(selected).format('DD MMM YYYY') : ''}
              {showTimeInterval && timeIntervalObj != null && timeIntervalObj.name != null ? ` ${timeIntervalObj.name}` : ''}
            </div>
            <i className="shipment-overview-date-picker-input__icon icon request-quote" />
          </React.Fragment>
          )
        }
      </div>);
  }
}

export default ShipmentOverviewDatePickerInput;