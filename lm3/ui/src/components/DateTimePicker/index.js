import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import noop from 'lodash/noop';
import isNil from 'lodash/isNil';

import DateTime from 'react-datetime';

import 'react-datetime/css/react-datetime.css';

class DateTimePicker extends Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.instanceOf(moment),
      PropTypes.string,
    ]),
    minDate: PropTypes.oneOfType([
      PropTypes.instanceOf(moment),
      PropTypes.string,
      PropTypes.number,
    ]),
    maxDate: PropTypes.oneOfType([
      PropTypes.instanceOf(moment),
      PropTypes.string,
      PropTypes.number,
    ]),
    inputClassName: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  };

  static defaultProps = {
    value: '',
    name: null,
    minDate: null,
    maxDate: null,
    inputClassName: null,
    className: '',
    onChange: noop,
    onFocus: noop,
    onBlur: noop,
  };

  handleChange = date => {
    if (typeof date === 'string') {
      return;
    }

    this.props.onChange(date);
  };

  handleFocus = date => this.props.onFocus(date);

  handleBlur = date => this.props.onBlur(date);

  validDays = date => {
    const { minDate, maxDate } = this.props;
    const momentDate = moment(date);

    if (isNil(minDate) && isNil(maxDate)) {
      return true;
    }

    if (!isNil(minDate) && momentDate.isSameOrAfter(minDate, 'day')) {
      return true;
    }

    if (!isNil(maxDate) && momentDate.isSameOrBefore(maxDate, 'day')) {
      return true;
    }

    return false;
  }

  render() {
    const {
      name,
      value,
      inputClassName,
      className,
    } = this.props;

    return (
      <DateTime
        inputProps={{
          name,
          autoComplete: 'off',
          className: inputClassName,
        }}
        className={className}
        value={moment.isMoment(value) ? value : moment(value)}
        dateFormat="MM-DD-YYYY"
        timeFormat="HH:mm"
        utc
        isValidDate={this.validDays}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      />
    );
  }
}

export default DateTimePicker;
