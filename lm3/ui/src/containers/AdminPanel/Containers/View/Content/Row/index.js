import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  ListGroupItem,
  Col,
} from 'reactstrap';

class ContentRow extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.node,
    isEmpty: PropTypes.bool,
  };

  static defaultProps = {
    isEmpty: false,
    children: null,
  }

  render() {
    const { label, children, isEmpty } = this.props;

    return (
      <ListGroupItem className="d-flex">
        <Col className="label" sm="5">{label}</Col>
        <Col sm="7">
          {isEmpty || !children ? <i>&mdash;</i> : children}
        </Col>
      </ListGroupItem>
    );
  }
}

export default ContentRow;
