import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import Moment from 'react-moment';

const MomentUTC = ({
  date, format, optional, showTz,
}) => {
  if (!date && optional) {
    return <i>&mdash;</i>;
  }

  return (
    <Fragment>
      <Moment format={format} date={date} utc /> {showTz && 'UTC'}
    </Fragment>
  );
};

MomentUTC.propTypes = {
  optional: PropTypes.bool,
  showTz: PropTypes.bool,
  format: PropTypes.string,
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(moment),
    PropTypes.string,
    PropTypes.number,
  ]),
};

MomentUTC.defaultProps = {
  optional: false,
  showTz: true,
  format: 'MMM/DD/YYYY HH:mm',
  date: '',
};

export default MomentUTC;
