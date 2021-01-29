import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Table,
  Paper
} from '@material-ui/core';
import TableHead from './TableHead';
import TableBody from './TableBody';

class FullTable extends Component {
  applySort = (column, direction) => {
    const newDirection = direction === 'down' ? 'ASC' : 'DESC';
    this.props.applySort([column, newDirection]);
  };

  render() {
    return (
      <Paper style={{ overflowX: 'auto' }}>
        <Table>
          <TableHead select={this.props.select} applySort={this.applySort} />
          <TableBody
            requests={this.props.requests}
            statusChange={this.props.statusChange}
          />
        </Table>
      </Paper>
    );
  }
}

FullTable.propTypes = {
  applySort: PropTypes.func.isRequired,
  requests: PropTypes.arrayOf(PropTypes.any).isRequired,
  statusChange: PropTypes.func.isRequired,
  select: PropTypes.string.isRequired
};

export default FullTable;
