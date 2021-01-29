import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Spinner = ({ show, forseShow }) => {
  if (!show && !forseShow) { return null; }

  return (
    <img
      src={`${process.env.PUBLIC_URL}/spinner.svg`}
      alt="spinnerImage"
      id="spinner"
    />
  );
};

Spinner.propTypes = {
  show: PropTypes.bool.isRequired,
  forseShow: PropTypes.bool
};

Spinner.defaultProps = { forseShow: false };

const connectFunction = connect(
  ({ global: { spinner } }) => ({ show: spinner })
);

export default connectFunction(memo(Spinner));
