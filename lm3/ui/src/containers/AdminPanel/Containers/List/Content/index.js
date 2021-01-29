import React from 'react';
import PropTypes from 'prop-types';

import { Table } from 'reactstrap';

import Head from './Head';
import Heading from './Heading';
import Body from './Body';
import Row from './Row';
import Col from './Col';
import ActionsCol from './ActionsCol';
import Empty from './Empty';

const Content = ({ children }) => (
  <Table striped>
    {children}
  </Table>
);

Content.propTypes = {
  children: PropTypes.node,
};

Content.defaultProps = {
  children: null,
};

Content.Head = Head;
Content.Heading = Heading;
Content.Body = Body;
Content.Row = Row;
Content.Col = Col;
Content.ActionsCol = ActionsCol;
Content.Empty = Empty;

export default Content;
