import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { TableCell } from '@material-ui/core';

class ColumnTitle extends Component {
  state = {
    direction: this.props.startDirection
  }

  click = () => {
    const { select, value } = this.props;
    let direction = 'down';

    if (value === select && this.state.direction === 'down') {
      direction = 'up';
    }

    this.setState({
      direction
    });

    this.props.applySort(this.props.value, direction);
  };

  render() {
    let { className } = this.props;
    className = `${className} `;

    if (this.props.value === this.props.select) {
      className += `select ${this.state.direction}`;
    }
    return (
      <StyledTableCell className={className} onClick={this.click}>
        {this.props.title}
      </StyledTableCell>
    );
  }
}

const StyledTableCell = styled(TableCell)`
  && {
    padding-right: 25px;
    position: relative;
    text-align: center;
    cursor: pointer;
    user-select: none;
    min-width: 150px;
    vertical-align: middle;
    font-size: 16px;
    line-height: 19px;
  }
`;

ColumnTitle.propTypes = {
  startDirection: PropTypes.string,
  className: PropTypes.string,
  select: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  applySort: PropTypes.func.isRequired
};

ColumnTitle.defaultProps = {
  startDirection: 'down',
  className: ''
};

export default ColumnTitle;
