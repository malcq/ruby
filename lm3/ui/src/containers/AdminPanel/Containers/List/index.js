import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Content from './Content';

const List = ({ children }) => (
  <div className="index-page">
    {children}
  </div>
);

List.propTypes = {
  children: PropTypes.node,
};

List.defaultProps = {
  children: null,
};

List.Header = Header;
List.Content = Content;

export default List;
