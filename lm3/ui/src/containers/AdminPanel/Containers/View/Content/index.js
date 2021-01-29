import React from 'react';
import PropTypes from 'prop-types';

import { ListGroup } from 'reactstrap';

import Row from './Row';

const Content = ({ children }) => (
  <ListGroup>
    {children}
  </ListGroup>
);

Content.propTypes = {
  children: PropTypes.node,
};

Content.defaultProps = {
  children: null,
};

Content.Row = Row;

export default Content;
