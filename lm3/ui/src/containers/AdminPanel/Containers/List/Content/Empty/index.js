import React from 'react';

import Row from '../Row';
import Col from '../Col';

const Empty = () => (
  <Row>
    <Col colSpan="20" align="center">No records</Col>
  </Row>
);

export default Empty;
