import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { InlineDateTimePicker } from 'material-ui-pickers';

function DatePicker(props) {
  return (
    <InlineDateTimePicker margin="normal" {...props} format="DD/MM/YYYY" />
  );
}

DatePicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment)
  ]),
  onChange: PropTypes.func,
  minDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment)
  ])
};

DatePicker.defaultProps = {
  label: '',
  value: new Date(),
  minDate: new Date(),
  onChange: () => null
};

export default DatePicker;
