import React from 'react';
import PropTypes from 'prop-types';

const Body = ({ children }) => (
  <tbody>
    {children}
  </tbody>
);

Body.propTypes = {
  children: PropTypes.node,
};

Body.defaultProps = {
  children: null,
};

export default Body;
