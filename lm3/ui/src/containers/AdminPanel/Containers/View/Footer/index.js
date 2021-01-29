import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({ children }) => (
  <div className="d-flex justify-content-end mt-4">
    {children}
  </div>
);

Footer.propTypes = {
  children: PropTypes.node,
};

Footer.defaultProps = {
  children: null,
};

export default Footer;
