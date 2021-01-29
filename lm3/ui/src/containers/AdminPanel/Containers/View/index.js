import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Content from './Content';
import Footer from './Footer';

const View = ({ children }) => (
  <div className="view-page col-lg-8 col-md-10 col-sm-12 mx-auto">
    {children}
  </div>
);

View.propTypes = {
  children: PropTypes.node,
};

View.defaultProps = {
  children: null,
};

View.Header = Header;
View.Content = Content;
View.Footer = Footer;

export default View;
