import React from 'react';
import PropTypes from 'prop-types';

const Head = ({ children }) => (
  <thead>
    {children}
  </thead>
);

Head.propTypes = {
  children: PropTypes.node,
};

Head.defaultProps = {
  children: null,
};

export default Head;
