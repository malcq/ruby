import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Table,
  Paper
} from '@material-ui/core';
import TableHead from './TableHead';
import TableBody from './TableBody';

class FullTable extends Component {
  state = {
    select: 'id'
  }

  applySort = (column, direction) => {
    this.setState({
      select: column
    });
    const newDirection = direction === 'down' ? 'ASC' : 'DESC';
    this.props.applySort([column, newDirection]);
  };

  render() {
    return (
      <Paper style={{ overflowX: 'auto' }}>
        <Table>
          <TableHead select={this.state.select} applySort={this.applySort} />
          <TableBody
            projects={this.props.projects}
            refreshProjects={this.props.refreshProjects}
          />
        </Table>
      </Paper>
    );
  }
}

FullTable.propTypes = {
  applySort: PropTypes.func.isRequired,
  projects: PropTypes.arrayOf(PropTypes.any).isRequired,
  refreshProjects: PropTypes.func.isRequired
};

export default FullTable;
